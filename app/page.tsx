import { ArrowRight, CheckCircle, Cloud, CreditCard, Send, Shield, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Footer from "@/components/Footer"
import { Header } from "@/components/Header"
import GradientDesign from "@/components/Gradient"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light-blue to-white">
      <Header/>
      {/* Hero Section */}
      {/* <GradientDesign>
      </GradientDesign> */}
      <section className="text-background py-20 md:py-32 hero-section">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-dark-navy mb-6">
              Streamline Your B2B Invoice Management
            </h1>
            <p className="text-xl md:text-2xl text-dark-navy/70 mb-8 leading-relaxed">
              Store, process, and manage your business invoices in the cloud. Send payment requests and provide seamless
              payment interfaces for your B2B transactions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" variant={"default"}>
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-dark-navy/60">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary-blue mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary-blue mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary-blue mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-navy mb-4">
              Everything You Need for Invoice Management
            </h2>
            <p className="text-xl text-dark-navy/70 max-w-2xl mx-auto">
              Powerful features designed to simplify your B2B invoice workflow and accelerate payments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-medium-blue/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Cloud className="h-12 w-12 text-primary-blue mb-4" />
                <CardTitle className="text-dark-navy">Cloud Storage</CardTitle>
                <CardDescription>
                  Securely store all your B2B invoices in the cloud with automatic backups and easy access from
                  anywhere.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-medium-blue/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Send className="h-12 w-12 text-primary-blue mb-4" />
                <CardTitle className="text-dark-navy">Smart Invoice Sending</CardTitle>
                <CardDescription>
                  Send professional invoices to other businesses with automated follow-ups and payment reminders.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-medium-blue/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CreditCard className="h-12 w-12 text-primary-blue mb-4" />
                <CardTitle className="text-dark-navy">Payment Processing</CardTitle>
                <CardDescription>
                  Integrated payment interface that makes it easy for clients to pay invoices quickly and securely.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-medium-blue/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary-blue mb-4" />
                <CardTitle className="text-dark-navy">Automated Workflows</CardTitle>
                <CardDescription>
                  Streamline your invoice process with automated payment requests and status tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-medium-blue/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-primary-blue mb-4" />
                <CardTitle className="text-dark-navy">B2B Focused</CardTitle>
                <CardDescription>
                  Built specifically for business-to-business transactions with enterprise-grade features.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-medium-blue/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary-blue mb-4" />
                <CardTitle className="text-dark-navy">Bank-Level Security</CardTitle>
                <CardDescription>
                  Your financial data is protected with enterprise-grade encryption and security protocols.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-light-blue to-medium-blue/10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-navy mb-6">Accelerate Your Invoice Flow</h2>
              <p className="text-lg text-dark-navy/70 mb-8">
                Stop chasing payments and start getting paid faster. Our platform reduces the average payment time by
                significantly through automated reminders and seamless payment processing.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary-blue mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-dark-navy">Faster Payments</h3>
                    <p className="text-dark-navy/70">Get paid faster with automated payment reminders</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary-blue mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-dark-navy">Reduced Admin Work</h3>
                    <p className="text-dark-navy/70">Save 10+ hours per week on invoice management tasks</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary-blue mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-dark-navy">Better Cash Flow</h3>
                    <p className="text-dark-navy/70">Improve cash flow predictability with real-time tracking</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-blue mb-2">65%</div>
                <div className="text-dark-navy/70 mb-6">Faster payment collection</div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary-blue">10+</div>
                    <div className="text-sm text-dark-navy/70">Hours saved weekly</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-blue">99.9%</div>
                    <div className="text-sm text-dark-navy/70">Uptime guarantee</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dark-navy">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Fascinating, isn&apos;t it?
            </h2>
            <p className="text-xl text-foreground mb-8">
              Subsribe to our newsletter to stay updated on our progress and be the first to know when we launch!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Input type="email" placeholder="Enter your business email" className="max-w-md bg-white border-1" />
              <Button size="lg" variant={"default"}>
                Subscribe
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="text-card-foreground text-sm">Do&apos;t worry, we won&apos;t spam your inbox • Cancel anytime</p>
          </div>
        </div>
      </section>

      <Footer/>      
    </div>
  )
}
