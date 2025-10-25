"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Highlighter } from "@/components/ui/highlighter"
import { Loader2, CheckCircle2, AlertCircle, Mail } from "lucide-react"

export function NewsletterForm() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    accepteConditions: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      accepteConditions: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.accepteConditions) {
      setSubmitStatus("error")
      setErrorMessage("Vous devez accepter de donner vos informations personnelles pour continuer.")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erreur lors de l'inscription")
      }

      setSubmitStatus("success")
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        accepteConditions: false,
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-4 border-[#E73628] relative overflow-visible shadow-xl">
      <div className="absolute -top-6 -right-6 z-10">
        <div className="w-16 h-16 bg-[#4AAD33] rounded-full flex items-center justify-center shadow-lg">
          <Mail className="w-8 h-8 text-white" />
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-2xl font-black uppercase font-[family-name:var(--font-raleway)]">
          Inscription à la Newsletter
        </CardTitle>
        <CardDescription>Remplissez le formulaire ci-dessous pour recevoir nos actualités</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                name="nom"
                type="text"
                required
                value={formData.nom}
                onChange={handleChange}
                placeholder="Votre nom"
                className="border-2 focus:border-[#4AAD33]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                name="prenom"
                type="text"
                required
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Votre prénom"
                className="border-2 focus:border-[#4AAD33]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="votre.email@exemple.com"
              className="border-2 focus:border-[#4AAD33]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              name="telephone"
              type="tel"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="06 12 34 56 78"
              className="border-2 focus:border-[#4AAD33]"
            />
          </div>

          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <Checkbox
              id="accepteConditions"
              checked={formData.accepteConditions}
              onCheckedChange={handleCheckboxChange}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="accepteConditions" className="text-sm font-medium leading-relaxed cursor-pointer">
                J'accepte de donner mes informations personnelles pour recevoir la newsletter des États Généraux
                Communaux *
              </Label>
              <p className="text-xs text-gray-600 mt-1">
                Vos données seront utilisées uniquement pour vous envoyer notre newsletter et ne seront jamais partagées
                avec des tiers.
              </p>
            </div>
          </div>

          {submitStatus === "success" && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border-2 border-[#4AAD33] rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-[#4AAD33] flex-shrink-0" />
              <p className="text-sm text-[#4AAD33] font-medium">
                Inscription réussie ! Vous recevrez bientôt notre newsletter.
              </p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border-2 border-[#E73628] rounded-lg">
              <AlertCircle className="h-5 w-5 text-[#E73628] flex-shrink-0" />
              <p className="text-sm text-[#E73628] font-medium">{errorMessage}</p>
            </div>
          )}

          <Button type="submit" variant="ghost" size="lg" disabled={isSubmitting} className="w-full">
            <Highlighter
              action="highlight"
              color="#B4D19F"
              strokeWidth={4}
              animationDuration={600}
              iterations={1}
              padding={6}
              isView={true}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                "S'inscrire à la newsletter"
              )}
            </Highlighter>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
