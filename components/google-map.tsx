"use client"

import { useEffect, useRef, useState } from "react"
import type { WordPressLocalGroup } from "@/lib/wordpress"
import { getGoogleMapsApiKey } from "@/app/actions/maps"

interface GoogleMapProps {
  groups: WordPressLocalGroup[]
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export function GoogleMap({ groups }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const mapInitializedRef = useRef(false)

  useEffect(() => {
    let isMounted = true
    let scriptAdded = false

    const loadAndInitialize = async () => {
      try {
        // Step 1: Fetch API key
        console.log("[v0] Fetching Google Maps API key...")
        const apiKey = await getGoogleMapsApiKey()

        if (!isMounted) return

        if (!apiKey) {
          console.log("[v0] Google Maps API key not configured")
          setError("Clé API Google Maps non configurée")
          return
        }

        console.log("[v0] API key fetched successfully")

        // Step 2: Check if Google Maps is already loaded
        if (typeof window !== "undefined" && window.google?.maps?.Map) {
          console.log("[v0] Google Maps already loaded, initializing map...")
          setIsLoaded(true)
          return
        }

        // Step 3: Load Google Maps script
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')

        if (existingScript) {
          console.log("[v0] Google Maps script already exists, waiting for load...")
          // Wait for existing script to load
          await new Promise<void>((resolve) => {
            const checkLoaded = () => {
              if (window.google?.maps?.Map) {
                resolve()
              } else {
                setTimeout(checkLoaded, 100)
              }
            }
            checkLoaded()
          })
        } else {
          console.log("[v0] Loading Google Maps script...")
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script")
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`
            script.async = true
            script.defer = true

            script.onload = () => {
              console.log("[v0] Google Maps script loaded, waiting for API...")
              scriptAdded = true
              const checkApiReady = () => {
                if (window.google?.maps?.Map) {
                  console.log("[v0] Google Maps API ready")
                  resolve()
                } else {
                  setTimeout(checkApiReady, 50)
                }
              }
              checkApiReady()
            }

            script.onerror = () => {
              console.error("[v0] Failed to load Google Maps script")
              reject(new Error("Failed to load Google Maps script"))
            }

            document.head.appendChild(script)
          })
        }

        if (!isMounted) return

        console.log("[v0] Google Maps loaded successfully")
        setIsLoaded(true)
      } catch (err) {
        console.error("[v0] Error loading Google Maps:", err)
        if (isMounted) {
          setError("Erreur lors du chargement de Google Maps")
        }
      }
    }

    loadAndInitialize()

    return () => {
      isMounted = false
    }
  }, []) // Only run once on mount

  useEffect(() => {
    if (!isLoaded || error || groups.length === 0 || mapInitializedRef.current) {
      return
    }

    console.log("[v0] Initializing map with", groups.length, "groups")

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeMap()
    }, 100)

    return () => clearTimeout(timer)
  }, [isLoaded, error, groups])

  const initializeMap = () => {
    if (mapInitializedRef.current) {
      console.log("[v0] Map already initialized, skipping")
      return
    }

    if (!mapRef.current) {
      console.error("[v0] Map container ref is null")
      return
    }

    if (!window.google?.maps?.Map) {
      console.error("[v0] Google Maps API not available")
      return
    }

    if (mapRef.current.offsetWidth === 0 || mapRef.current.offsetHeight === 0) {
      console.error("[v0] Map container has no dimensions, retrying...")
      setTimeout(() => {
        initializeMap()
      }, 100)
      return
    }

    console.log("[v0] Creating map instance...")
    mapInitializedRef.current = true

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 6,
        center: { lat: 46.603354, lng: 1.888334 },
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })

      setMapInstance(map)
      console.log("[v0] Map instance created successfully")

      let markersAdded = 0
      groups.forEach((group, index) => {
        if (group.acf?.localisation?.lat && group.acf?.localisation?.lng) {
          console.log(`[v0] Adding marker ${index + 1}:`, group.acf?.nom_de_groupe || group.title.rendered)

          const marker = new window.google.maps.Marker({
            position: {
              lat: Number.parseFloat(group.acf.localisation.lat),
              lng: Number.parseFloat(group.acf.localisation.lng),
            },
            map: map,
            title: group.acf?.nom_de_groupe || group.title.rendered,
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#3b82f6" stroke="white" strokeWidth="2"/>
                  <circle cx="16" cy="16" r="4" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 16),
            },
          })

          markersAdded++

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 12px; max-width: 300px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                  ${group.acf?.nom_de_groupe || group.title.rendered}
                </h3>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; line-height: 1.4;">
                  ${group.acf?.descriptif || "Description du groupe local"}
                </p>
                <div style="font-size: 12px; color: #9ca3af;">
                  <div style="margin-bottom: 4px;">
                    📍 ${group.acf?.localisation?.address || "Adresse non définie"}
                  </div>
                  ${
                    group.acf?.nom_de_contact
                      ? `
                    <div style="margin-bottom: 4px;">
                      👤 ${group.acf.nom_de_contact}
                    </div>
                  `
                      : ""
                  }
                  ${
                    group.acf?.email_de_contact
                      ? `
                    <div style="margin-bottom: 4px;">
                      ✉️ <a href="mailto:${group.acf.email_de_contact}" style="color: #3b82f6; text-decoration: none;">
                        ${group.acf.email_de_contact}
                      </a>
                    </div>
                  `
                      : ""
                  }
                  ${
                    group.acf?.site_web
                      ? `
                    <div>
                      🌐 <a href="${group.acf.site_web}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: none;">
                        Site web
                      </a>
                    </div>
                  `
                      : ""
                  }
                </div>
              </div>
            `,
          })

          marker.addListener("click", () => {
            infoWindow.open(map, marker)
          })
        }
      })

      console.log(`[v0] Added ${markersAdded} markers to the map`)

      if (markersAdded > 0) {
        const bounds = new window.google.maps.LatLngBounds()
        groups.forEach((group) => {
          if (group.acf?.localisation?.lat && group.acf?.localisation?.lng) {
            bounds.extend({
              lat: Number.parseFloat(group.acf.localisation.lat),
              lng: Number.parseFloat(group.acf.localisation.lng),
            })
          }
        })
        map.fitBounds(bounds)

        const listener = window.google.maps.event.addListener(map, "idle", () => {
          if (map.getZoom() > 10) map.setZoom(10)
          window.google.maps.event.removeListener(listener)
        })
      }
    } catch (error) {
      console.error("[v0] Error initializing map:", error)
      setError("Erreur lors de l'initialisation de la carte")
      mapInitializedRef.current = false
    }
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted rounded-lg">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-muted-foreground font-medium">Erreur de configuration</p>
            <p className="text-sm text-muted-foreground">
              {error.includes("Clé API")
                ? "Configurez votre clé API Google Maps pour voir la carte interactive"
                : "Vérifiez les restrictions de domaine de votre clé API Google Maps"}
            </p>
          </div>
          <div className="text-xs text-muted-foreground bg-muted-foreground/10 rounded p-2">
            {groups.length} groupe{groups.length > 1 ? "s" : ""} local{groups.length > 1 ? "aux" : ""} disponible
            {groups.length > 1 ? "s" : ""}
          </div>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted rounded-lg animate-pulse">
        <p className="text-muted-foreground">Chargement de la carte...</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      {process.env.NODE_ENV === "development" && (
        <div className="mb-2 text-xs text-muted-foreground">
          Debug: {groups.length} groupes, API chargée: {isLoaded ? "Oui" : "Non"}
        </div>
      )}
      <div ref={mapRef} className="h-full w-full rounded-lg" style={{ minHeight: "400px" }} />
    </div>
  )
}
