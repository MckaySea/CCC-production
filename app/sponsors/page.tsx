import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, TrendingUp, Target, Eye, Award, Zap } from "lucide-react"
import Image from "next/image"

export default function SponsorsPage() {
  const stats = [
    { icon: Users, value: "50+", label: "Active Players" },
    { icon: Eye, value: "10K+", label: "Monthly Reach" },
    { icon: Target, value: "6", label: "Competitive Games" },
    { icon: Award, value: "12", label: "Championships Won" },
  ]

  const benefits = [
    {
      icon: TrendingUp,
      title: "Brand Visibility",
      description:
        "Your logo featured on team jerseys, social media, and tournament streams reaching thousands of viewers.",
    },
    {
      icon: Users,
      title: "Engaged Audience",
      description: "Connect with a passionate, tech-savvy demographic of college students and gaming enthusiasts.",
    },
    {
      icon: Target,
      title: "Targeted Marketing",
      description:
        "Direct access to the growing esports market with authentic brand integration and community engagement.",
    },
    {
      icon: Zap,
      title: "Content Creation",
      description:
        "Collaborative content opportunities including sponsored streams, social media features, and event coverage.",
    },
  ]

  const tiers = [
    {
      name: "Bronze",
      price: "$500",
      period: "/semester",
      features: [
        "Logo on team website",
        "Social media shoutouts (2/month)",
        "Recognition at home events",
        "Quarterly impact report",
      ],
      highlight: false,
    },
    {
      name: "Silver",
      price: "$1,500",
      period: "/semester",
      features: [
        "Everything in Bronze",
        "Logo on team jerseys",
        "Social media shoutouts (4/month)",
        "Booth space at major events",
        "Monthly analytics report",
        "Product sampling opportunities",
      ],
      highlight: true,
    },
    {
      name: "Gold",
      price: "$3,000",
      period: "/semester",
      features: [
        "Everything in Silver",
        "Title sponsor of one team",
        "Dedicated social media content",
        "Premium booth at all events",
        "Weekly analytics dashboard",
        "Co-branded merchandise",
        "Exclusive networking events",
      ],
      highlight: false,
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 bg-background">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
          <div className="absolute inset-0 bg-[url('/esports-gaming-arena-with-dramatic-lighting.jpg')] bg-cover bg-center opacity-5" />

          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-sm font-bold text-primary uppercase tracking-wider">
                  Partnership Opportunities
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 leading-tight">
                Power the Next Generation of <span className="text-primary">Esports</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                Partner with CCC Esports to reach an engaged audience of competitive gamers and support the future of
                collegiate esports.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 group">
                  Become a Sponsor
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                  Download Media Kit
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-card/50 border-y border-border">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-10 h-10 mx-auto mb-3 text-primary" />
                  <div className="text-4xl md:text-5xl font-black mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Partner Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">
                Why Partner with <span className="text-primary">CCC Esports</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join leading brands in supporting competitive gaming and connecting with the next generation of
                consumers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-card border-2 border-primary/20 rounded-lg p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsorship Tiers */}
        <section className="py-24 px-4 bg-card/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">
                Sponsorship <span className="text-primary">Tiers</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the partnership level that aligns with your brand goals and budget.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {tiers.map((tier, index) => (
                <div
                  key={index}
                  className={`relative bg-card rounded-lg p-8 ${
                    tier.highlight
                      ? "border-2 border-primary shadow-lg shadow-primary/20 scale-105"
                      : "border border-border"
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-bold uppercase rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-black uppercase mb-2">{tier.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-black">{tier.price}</span>
                      <span className="text-muted-foreground">{tier.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full" variant={tier.highlight ? "default" : "outline"} size="lg">
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 rounded-2xl p-12 text-center">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <Image src="/ccc-esports-logo.png" alt="CCC Esports Logo" fill className="object-contain" />
              </div>

              <h2 className="text-3xl md:text-5xl font-black uppercase mb-4">Ready to Join Our Team?</h2>

              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's discuss how a partnership with CCC Esports can elevate your brand and support the future of
                competitive gaming.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8">
                  Contact Us
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                  Schedule a Call
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
