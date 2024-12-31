'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bitcoin, Cpu, TrendingUp, Shield, Clock, Zap, ChevronUp, AlertTriangle, DollarSign } from 'lucide-react'
import { InvestmentSimulator } from '@/components/InvestmentSimulator'
import EnhancedTradingChart from '@/components/EnhancedTradingChart'
import { Waitlist } from "@clerk/nextjs"
import { AppIntegrations } from '@/components/AppIntegrations'

// Navbar Component
const Navbar = ({ onJoinWaitlist }: { onJoinWaitlist: () => void }) => (
  <nav className="border-b border-indigo-800/50 backdrop-blur-lg fixed w-full z-50 bg-gray-900/80">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center">
          <Bitcoin className="w-6 h-6 md:w-8 md:h-8 mr-2" /> CRYPTO PRO-TRADER
        </span>
        <Button
          variant="outline"
          className="border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all duration-200"
          onClick={onJoinWaitlist}
        >
          Join Waitlist
        </Button>
      </div>
    </div>
  </nav>
)

// Hero Section Component
const HeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => (
  <section className="pt-24 md:pt-32 pb-16 md:pb-20 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-medium mb-6">
          <Cpu className="inline-block w-4 h-4 mr-2" /> AI-Powered Trading Assistant
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
          CRYPTO PRO-TRADER
          <span className="block mt-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Smart Trading Made Easy
          </span>
        </h1>
        <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
          Our AI analyzes millions of data points to give you clear buy or wait signals.
          Start with just any amount on your favorite trading app.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-6 text-lg"
            onClick={onGetStarted}
          >
            Get Early Access
          </Button>
        </div>
      </div>
    </div>
  </section>
)

// Crypto Card Component
const CryptoCard = ({ name, symbol, icon, trend, isPositive }: { 
  name: string, 
  symbol: string, 
  icon: React.ReactNode, 
  trend: string, 
  isPositive: boolean 
}) => (
  <Card className="bg-gray-800/50 backdrop-blur border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300">
    <CardContent className="p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 w-8 h-8 md:w-12 md:h-12">{icon}</div>
          <div>
            <h3 className="text-base md:text-lg font-semibold text-white">{name}</h3>
            <p className="text-sm md:text-base text-indigo-300">{symbol}</p>
          </div>
        </div>
        <span className={`text-sm md:text-base font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {trend}
        </span>
      </div>
    </CardContent>
  </Card>
)

// Feature Card Component
const FeatureCard = ({ icon, title, description, image }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  image: string 
}) => (
  <Card className="bg-gray-800/50 backdrop-blur border-indigo-500/20 overflow-hidden">
    <CardContent className="p-4 md:p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-sm md:text-base text-indigo-200 mb-4">{description}</p>
      <Image 
        src={image}
        alt={title}
        width={160}
        height={160}
        className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-lg object-cover"
      />
    </CardContent>
  </Card>
)

// Step Card Component
const StepCard = ({ number, title, description, icon }: { 
  number: number, 
  title: string, 
  description: string, 
  icon: React.ReactNode 
}) => (
  <Card className="bg-gray-800/50 backdrop-blur border-indigo-500/20">
    <CardContent className="p-4 md:p-6 text-center">
      {icon}
      <div className="text-2xl md:text-3xl font-bold text-indigo-400 mb-4">{number}</div>
      <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-sm md:text-base text-indigo-200">{description}</p>
    </CardContent>
  </Card>
)

// Footer Component 
const Footer = () => (
  <footer className="py-8 px-4 border-t border-indigo-800/50">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-4 text-white flex items-center">
            <Bitcoin className="w-6 h-6 mr-2" /> CRYPTO PRO-TRADER
          </h3>
          <p className="text-sm md:text-base text-indigo-200">
            Making crypto trading smarter with AI for everyday traders.
          </p>
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-4 text-white">Supported Apps</h3>
          <ul className="text-sm md:text-base text-indigo-200 grid grid-cols-2 gap-2">
            <li>Coinbase</li>
            <li>Binance</li>
            <li>Robinhood</li>
            <li>Kraken</li>
            <li>Gemini</li>
            <li>FTX</li>
            <li>eToro</li>
            <li>Bitfinex</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-4 text-white">Contact</h3>
          <p className="text-sm md:text-base text-indigo-200">
            support@cryptoprotrader.com<br />
            Follow us on Twitter @CryptoProTrader
          </p>
        </div>
      </div>
      <div className="text-center text-indigo-300 pt-8 border-t border-indigo-800/50">
        <p>© 2024 CRYPTO PRO-TRADER. All rights reserved.</p>
        <p className="mt-2 text-sm">
          Powered by advanced AI and machine learning to help you trade smarter.
        </p>
      </div>
    </div>
  </footer>
)

// Main Page Component
export default function LandingPage() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSignup = () => {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-900 to-gray-900 text-white">
      <Navbar onJoinWaitlist={scrollToSignup} />
      <HeroSection onGetStarted={scrollToSignup} />

      {/* Cryptocurrencies Section */}
      <section className="py-16 md:py-20 px-4 bg-indigo-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
              Popular Cryptocurrencies We Track
            </h2>
            <p className="text-indigo-200 max-w-2xl mx-auto">
              Get AI-powered insights for the most traded cryptocurrencies
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <CryptoCard 
              name="Bitcoin" 
              symbol="BTC" 
              icon={<Image src="/btc-icon.png" alt="BTC" width={48} height={48} />}
              trend="+3.5%"
              isPositive={true}
            />
            <CryptoCard 
              name="Ethereum" 
              symbol="ETH" 
              icon={<Image src="/eth-icon.png" alt="ETH" width={48} height={48} />}
              trend="+5.2%"
              isPositive={true}
            />
            <CryptoCard 
              name="Solana" 
              symbol="SOL" 
              icon={<Image src="/sol-icon.png" alt="SOL" width={48} height={48} />}
              trend="-2.1%"
              isPositive={false}
            />
            <CryptoCard 
              name="Cardano" 
              symbol="ADA" 
              icon={<Image src="/ada-icon.png" alt="ADA" width={48} height={48} />}
              trend="+1.8%"
              isPositive={true}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
              AI-Powered Features
            </h2>
            <p className="text-indigo-200 max-w-2xl mx-auto">
              Advanced technology made simple for everyday traders
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<div className="relative">
                <div className="absolute -inset-1 bg-indigo-500 rounded-full blur-sm opacity-30"></div>
                <TrendingUp className="w-8 h-8 text-indigo-400 relative" />
              </div>}
              title="Smart Signals"
              description="Get clear buy or wait recommendations based on AI analysis of market trends"
              image="/feature-signals.png"
            />
            <FeatureCard
              icon={<div className="relative">
                <div className="absolute -inset-1 bg-indigo-500 rounded-full blur-sm opacity-30"></div>
                <Shield className="w-8 h-8 text-indigo-400 relative" />
              </div>}
              title="Risk Detection"
              description="AI monitors market risks 24/7 to protect your investments from volatility"
              image="/feature-risk.png"
            />
            <FeatureCard
              icon={<div className="relative">
                <div className="absolute -inset-1 bg-indigo-500 rounded-full blur-sm opacity-30"></div>
                <Clock className="w-8 h-8 text-indigo-400 relative" />
              </div>}
              title="Perfect Timing"
              description="Get notified of the best moments to enter or exit positions"
              image="/feature-timing.png"
            />
          </div>
        </div>
      </section>

      {/* Investment Simulator Section */}
      <section className="py-16 md:py-20 px-4 bg-indigo-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
                Try Our AI-Powered Investment Simulator
              </h2>
              <p className="text-base md:text-lg text-indigo-200 mb-8">
                Test your trading strategies with our smart simulator before risking real money. 
                Get personalized insights and recommendations based on your investment style.
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <InvestmentSimulator />
            </div>
          </div>
        </div>
      </section>

      {/* Chart Section */}
<section className="py-16 md:py-20 px-4">
  <div className="max-w-6xl mx-auto">
    <div className="text-center mb-8 md:mb-12">
      <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
        Advanced Market Analysis
      </h2>
      <p className="text-indigo-200 max-w-2xl mx-auto">
        Track market movements with our AI-enhanced trading charts
      </p>
    </div>
    <div className="bg-gray-800/50 p-4 rounded-lg">
      <EnhancedTradingChart />
    </div>
  </div>
</section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 px-4 bg-indigo-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
              How Our AI Trading Assistant Works
            </h2>
            <p className="text-indigo-200 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <StepCard
              number={1}
              title="Connect Your Trading App"
              description="Seamlessly integrates with popular apps like Coinbase, Binance, and more"
              icon={<Image src="/step1-icon.png" alt="Connect Apps" width={120} height={120} className="mb-6 mx-auto" />}
            />
            <StepCard
              number={2}
              title="Set Your Parameters"
              description="Start small with just $200 and customize your risk tolerance"
              icon={<Image src="/step2-icon.png" alt="Set Parameters" width={120} height={120} className="mb-6 mx-auto" />}
            />
            <StepCard
              number={3}
              title="Get AI Signals"
              description="Receive clear buy, sell, or hold recommendations based on AI analysis"
              icon={<Image src="/step3-icon.png" alt="AI Signals" width={120} height={120} className="mb-6 mx-auto" />}
            />
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="signup" className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
                Join Our Waitlist
              </h2>
              <p className="text-base md:text-lg text-indigo-200 mb-8">
                Be among the first to experience AI-powered crypto trading. Get early access and exclusive benefits.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Shield className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="text-indigo-100">Priority Access</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <DollarSign className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="text-indigo-100">Early Bird Pricing</span>
                </div>
              </div>
            </div>
            <div>
              <Card className="bg-gray-800/50 backdrop-blur border-indigo-500/20">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold text-center mb-8 text-white">
                    Get Early Access to AI-Powered Trading
                  </h3>
                  <div className="space-y-6">
                    <Waitlist />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        {/* Trusted By Apps Section */}
        <div className="mt-16 md:mt-20">
          <p className="text-center text-sm md:text-base text-indigo-300 mb-8">Trusted by traders using</p>
          <AppIntegrations />
        </div>
      </section>

      <Footer />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-all duration-200"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-4 w-4 md:h-6 md:w-6" />
        </Button>
      )}
    </div>
  )
}