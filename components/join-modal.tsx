"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface JoinModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JoinModal({ open, onOpenChange }: JoinModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    discord: "",
    phone: "",
    email: "",
    over18: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission here
    onOpenChange(false)
    // Reset form
    setFormData({ firstName: "", lastName: "", discord: "", phone: "", email: "", over18: "" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-card via-card to-card/95 border-2 border-primary/30 shadow-2xl shadow-primary/20">
        <DialogHeader className="space-y-3 pb-2">
          <DialogTitle className="text-3xl font-black uppercase text-center bg-gradient-to-r from-primary via-primary to-cyan-400 bg-clip-text text-transparent">
            Join CCC Esports
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center text-base">
            Become part of our competitive gaming community
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-foreground font-semibold text-sm">
                First Name *
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-foreground font-semibold text-sm">
                Last Name *
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-semibold text-sm">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@college.edu"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discord" className="text-foreground font-semibold text-sm">
              Discord Name/Handle *
            </Label>
            <Input
              id="discord"
              type="text"
              placeholder="username#0000 or @username"
              required
              value={formData.discord}
              onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
              className="bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground font-semibold text-sm">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="space-y-3 pt-2">
            <Label className="text-foreground font-semibold text-sm">Are you over the age of 18? *</Label>
            <RadioGroup
              required
              value={formData.over18}
              onValueChange={(value) => setFormData({ ...formData, over18: value })}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" className="border-primary/50 text-primary" />
                <Label htmlFor="yes" className="text-foreground cursor-pointer font-medium">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" className="border-primary/50 text-primary" />
                <Label htmlFor="no" className="text-foreground cursor-pointer font-medium">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="submit"
              className="flex-1 font-bold uppercase tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
            >
              Submit Application
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-bold uppercase tracking-wide border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
