"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Highlighter } from "@/components/ui/highlighter"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

interface ParticiperFormProps {
  emailDestination: string
}

export function ParticiperForm({ emailDestination }: ParticiperFormProps) {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          emailDestination,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erreur lors de l'envoi du message")
      }

      setSubmitStatus("success")
      setFormData({
        nom: "",
        email: "",
        sujet: "",
        message: "",
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
    <Card className="border-4 border-[#E73628]">
      <CardHeader>
        <CardTitle className="text-2xl font-black uppercase font-[family-name:var(--font-raleway)]">
          Formulaire de contact
        </CardTitle>
        <CardDescription>Remplissez le formulaire ci-dessous pour nous contacter</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom complet *</Label>
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
            <Label htmlFor="sujet">Sujet *</Label>
            <Input
              id="sujet"
              name="sujet"
              type="text"
              required
              value={formData.sujet}
              onChange={handleChange}
              placeholder="Sujet de votre message"
              className="border-2 focus:border-[#4AAD33]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Votre message..."
              rows={6}
              className="border-2 focus:border-[#4AAD33]"
            />
          </div>

          {submitStatus === "success" && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border-2 border-[#4AAD33] rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-[#4AAD33]" />
              <p className="text-sm text-[#4AAD33] font-medium">Message envoyé avec succès !</p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border-2 border-[#E73628] rounded-lg">
              <AlertCircle className="h-5 w-5 text-[#E73628]" />
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
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le message"
              )}
            </Highlighter>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
