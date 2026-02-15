import { Link } from "react-router-dom";
import { MessageSquare, Mail, Github, Linkedin, Globe, ArrowLeft } from "lucide-react";

export default function About() {
  const socialLinks = [
    {
      icon: Mail,
      label: "Email",
      href: "mailto:sandeshsanjaykamble52@gmail.com",
      text: "sandeshsanjaykamble52@gmail.com",
    },
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/kamblesandesh01/",
      text: "kamblesandesh01",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/sandesh-sanjay-kamble/",
      text: "sandesh-sanjay-kamble",
    },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950">
      {/* Header */}
      <header className="bg-background dark:bg-slate-900 border-b border-border dark:border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F65551474d42d4acfa8fd16cdaf66a0f2%2F4228715ecc0144db9cc3b830849c3dd0?format=webp&width=800&height=1200"
              alt="IntentBot Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold text-foreground hidden sm:inline">
              IntentBot
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Developer Profile */}
          <div className="rounded-2xl border border-border bg-card p-8 md:p-12 shadow-lg">
            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-primary/20">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F65551474d42d4acfa8fd16cdaf66a0f2%2Fe897c6c9efda4925acf2bc351eb850c3"
                  alt="Sandesh Sanjay Kamble"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name and Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Sandesh Sanjay Kamble
              </h1>
              <p className="text-xl text-primary font-semibold">B.Sc. IT Student</p>
            </div>

            {/* Bio */}
            <div className="mb-8 text-center">
              <p className="text-lg text-foreground/70 leading-relaxed">
                Passionate developer building intelligent AI-powered applications.
                This intent-based chatbot is a showcase of modern web development
                combining React, TypeScript, and Express.js with a focus on user
                experience and clean code architecture.
              </p>
            </div>

            {/* Skills */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Skills & Technologies
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "React",
                  "TypeScript",
                  "Express.js",
                  "Tailwind CSS",
                  "Node.js",
                  "Full Stack Dev",
                  "AI Integration",
                  "Web Design",
                  "JavaScript",
                ].map((skill) => (
                  <div
                    key={skill}
                    className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium text-center border border-primary/20"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border dark:bg-slate-800 my-10"></div>

            {/* Contact Section */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Get in Touch
              </h2>

              <div className="space-y-4">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 w-full px-6 py-3 border border-border rounded-lg hover:bg-muted/50 hover:border-primary transition group"
                    >
                      <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition" />
                      <div className="text-left">
                        <p className="text-sm text-foreground/60">{link.label}</p>
                        <p className="font-medium text-foreground">{link.text}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Explore the Intent-Based Chatbot
            </h3>
            <Link
              to="/chat"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition shadow-lg"
            >
              Start Chatting
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border dark:border-slate-800 py-8 px-4 bg-muted/50 dark:bg-slate-800/50 mt-16">
        <div className="container mx-auto text-center text-foreground/60 text-sm">
          <p>© 2024 IntentBot. Built by Sandesh Sanjay Kamble</p>
        </div>
      </footer>
    </div>
  );
}
