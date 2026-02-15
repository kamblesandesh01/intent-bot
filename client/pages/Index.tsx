import { Link } from "react-router-dom";
import {
  MessageSquare,
  Zap,
  Brain,
  ArrowRight,
  CheckCircle,
  Users,
  Shield,
  Zap as ZapIcon,
  Cpu,
  Globe,
} from "lucide-react";
import Header from "@/components/Header";
import FeatureCard from "@/components/FeatureCard";

export default function Index() {
  const features = [
    {
      icon: Brain,
      title: "Intent Recognition",
      description:
        "Automatically understands what users want based on their messages",
    },
    {
      icon: Zap,
      title: "Smart Responses",
      description:
        "Provides contextual and accurate responses tailored to user intent",
    },
    {
      icon: MessageSquare,
      title: "Natural Conversation",
      description:
        "Engages in fluid, natural conversations that feel human-like",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your data is encrypted and never shared with third parties",
    },
    {
      icon: Cpu,
      title: "AI-Powered",
      description:
        "Built with cutting-edge machine learning technology",
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description:
        "Communicate in your preferred language seamlessly",
    },
  ];

  const useCases = [
    {
      title: "Customer Support",
      description:
        "Automatically handle customer inquiries and route complex issues to agents",
    },
    {
      title: "Lead Qualification",
      description:
        "Qualify leads through intelligent conversations and intent detection",
    },
    {
      title: "Booking & Reservations",
      description:
        "Help users book appointments, reservations, and services effortlessly",
    },
    {
      title: "Information Retrieval",
      description:
        "Provide instant answers to frequently asked questions",
    },
    {
      title: "Survey & Feedback",
      description:
        "Collect valuable feedback and survey responses naturally",
    },
    {
      title: "Sales Assistant",
      description:
        "Guide users through your product catalog and help with purchases",
    },
  ];

  const benefits = [
    {
      title: "24/7 Availability",
      description: "Available round the clock to assist your customers anytime",
    },
    {
      title: "Reduced Response Time",
      description: "Get instant responses instead of waiting for human agents",
    },
    {
      title: "Lower Operational Costs",
      description: "Automate repetitive tasks and reduce staffing needs",
    },
    {
      title: "Better Customer Satisfaction",
      description: "Provide consistent, accurate, and personalized responses",
    },
    {
      title: "Scalability",
      description: "Handle unlimited conversations simultaneously",
    },
    {
      title: "Data Insights",
      description: "Gain valuable insights from customer conversations",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 md:pt-32 pb-12 md:pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center">
            <div className="inline-block mb-4 md:mb-6 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-xs md:text-sm font-medium text-primary">
                AI-Powered Intent Recognition
              </span>
            </div>

            <h1 className="mb-4 md:mb-6 text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Understand User Intent{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Instantly
              </span>
            </h1>

            <p className="mb-2 md:mb-3 text-base md:text-lg lg:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed px-2">
              Our advanced chatbot recognizes what users really want and responds with precision. No more misunderstood requests.
            </p>
            <p className="mb-6 md:mb-8 text-sm md:text-base text-foreground/60 max-w-3xl mx-auto px-2">
              <span className="font-semibold text-primary">Understands meaning, not keywords</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-10 md:mb-16 px-2">
              <Link
                to="/chat"
                className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                Try Live Intent Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/#features"
                className="inline-flex items-center justify-center px-6 md:px-8 py-2.5 md:py-3 border border-border rounded-lg font-semibold text-foreground hover:bg-muted/50 transition text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Learn More
              </Link>
            </div>

            {/* Chat Preview - Responsive */}
            <div className="rounded-xl md:rounded-2xl border border-border overflow-hidden bg-card shadow-2xl mx-auto max-w-2xl">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-4 md:px-6 py-3 md:py-4 border-b border-border flex items-center gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500"></div>
                <span className="text-xs md:text-sm font-medium text-foreground">
                  IntentBot is online
                </span>
              </div>
              <div className="p-4 md:p-6 space-y-3 md:space-y-4 min-h-64 md:h-80 flex flex-col justify-between">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 md:p-4 max-w-xs text-sm md:text-base">
                      <p className="text-foreground">
                        Hi! I'm IntentBot. How can I help you today?
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 md:p-4 max-w-xs text-sm md:text-base">
                      <p>Can you help me with my account?</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 md:p-4 max-w-xs text-sm md:text-base">
                      <p className="text-foreground">
                        I detected that you need account assistance. I can help
                        you with password reset, profile updates, or billing
                        information. What would you prefer?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-3 md:px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
                    disabled
                  />
                  <button className="px-3 md:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 text-sm md:text-base" disabled>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10 md:mb-16 px-2">
            <h2 className="mb-3 md:mb-4 text-2xl md:text-4xl font-bold">How IntentBot Works</h2>
            <p className="text-foreground/70 text-base md:text-lg">
              A 4-step process to understand and respond to user needs
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Step 1: User */}
            <div className="relative">
              <div className="p-6 rounded-xl bg-card border border-border h-full flex flex-col">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">User Message</h3>
                <p className="text-foreground/70 text-sm leading-relaxed flex-grow">
                  Customer sends a message expressing their need
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                <ArrowRight className="w-6 h-6 text-primary/30" />
              </div>
            </div>

            {/* Step 2: Intent */}
            <div className="relative">
              <div className="p-6 rounded-xl bg-card border border-border h-full flex flex-col">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <span className="text-lg font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">Intent Detection</h3>
                <p className="text-foreground/70 text-sm leading-relaxed flex-grow">
                  AI analyzes meaning to identify true intent beyond keywords
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                <ArrowRight className="w-6 h-6 text-primary/30" />
              </div>
            </div>

            {/* Step 3: Confidence */}
            <div className="relative">
              <div className="p-6 rounded-xl bg-card border border-border h-full flex flex-col">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <span className="text-lg font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">Confidence Score</h3>
                <p className="text-foreground/70 text-sm leading-relaxed flex-grow">
                  System calculates accuracy level for the detected intent
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                <ArrowRight className="w-6 h-6 text-primary/30" />
              </div>
            </div>

            {/* Step 4: Response */}
            <div className="relative">
              <div className="p-6 rounded-xl bg-card border border-border h-full flex flex-col">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <span className="text-lg font-bold text-primary">4</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">Smart Response</h3>
                <p className="text-foreground/70 text-sm leading-relaxed flex-grow">
                  Bot generates tailored response matching the detected intent
                </p>
              </div>
            </div>
          </div>

          {/* Example Intents */}
          <div className="mt-12 md:mt-16 p-6 md:p-8 rounded-xl bg-muted/50 border border-border">
            <p className="text-center text-foreground/70 mb-4 text-sm font-medium uppercase tracking-wide">Example Intents We Recognize</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {["Order Status", "Refund", "Account Help", "Password Reset", "Billing", "Product Info"].map((intent) => (
                <div key={intent} className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
                  {intent}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10 md:mb-16 px-2">
            <h2 className="mb-3 md:mb-4 text-2xl md:text-4xl font-bold">Key Features</h2>
            <p className="text-foreground/70 text-base md:text-lg">
              Everything you need for intelligent conversations
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="usecases" className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10 md:mb-16 px-2">
            <h2 className="mb-3 md:mb-4 text-2xl md:text-4xl font-bold">Use Cases</h2>
            <p className="text-foreground/70 text-base md:text-lg">
              Discover how IntentBot can transform your business
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-card border border-border hover:border-secondary/30 hover:shadow-lg transition duration-300 group"
              >
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  {useCase.title}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-12 md:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10 md:mb-16 px-2">
            <h2 className="mb-3 md:mb-4 text-2xl md:text-4xl font-bold">Why Choose IntentBot?</h2>
            <p className="text-foreground/70 text-base md:text-lg">
              Transform your customer interactions with powerful benefits
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center px-2">
          <h2 className="mb-3 md:mb-6 text-2xl md:text-4xl font-bold">Ready to Experience Intent Recognition?</h2>
          <p className="text-base md:text-lg text-foreground/70 mb-6 md:mb-8">
            Start chatting with our AI-powered intent-based chatbot and see how
            it understands your needs.
          </p>
          <Link
            to="/chat"
            className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition shadow-lg hover:shadow-xl text-base md:text-lg"
          >
            Open Chat
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 md:py-12 px-4 bg-muted/50">
        <div className="container mx-auto max-w-5xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 text-center sm:text-left">
            <div>
              <h4 className="font-semibold text-foreground mb-3">IntentBot</h4>
              <p className="text-sm text-foreground/60">
                AI-powered intent-based chatbot for intelligent conversations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-foreground/60 hover:text-foreground transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/chat" className="text-foreground/60 hover:text-foreground transition">
                    Chat
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-foreground/60 hover:text-foreground transition">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Developer</h4>
              <p className="text-sm text-foreground/60 mb-2">Sandesh Sanjay Kamble</p>
              <div className="flex gap-3 justify-center sm:justify-start">
                <a
                  href="mailto:sandeshsanjaykamble52@gmail.com"
                  className="text-foreground/60 hover:text-primary transition"
                  title="Email"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V16a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/kamblesandesh01/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-primary transition"
                  title="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.186.092-.923.35-1.544.636-1.898-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817a9.56 9.56 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.194 20 14.44 20 10.017 20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/sandesh-sanjay-kamble/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-primary transition"
                  title="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.553-1.553-2.553-1.554 0-1.793 1.213-1.793 2.466v3.265H8.5V7.5h2.559v1.17h.037c.357-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.963zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-9.12H3.667v9.12zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 md:pt-8 text-center text-foreground/60 text-xs md:text-sm">
            <p>© {new Date().getFullYear()} IntentBot. Built by Sandesh Sanjay Kamble. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
