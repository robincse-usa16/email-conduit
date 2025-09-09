import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import AnimatedCard from "@/components/AnimatedCard";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "support@multimail.com",
      description: "Get support within 24 hours"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri 9AM-6PM EST"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "123 Tech Street, Silicon Valley, CA",
      description: "Our headquarters"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Fri: 9AM-6PM EST",
      description: "Weekend support available"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in-up">
              Get in{" "}
              <span className="gradient-hero bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: "200ms"}}>
              Have questions about MultiMail? We're here to help! Reach out to our team 
              and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <AnimatedCard delay={300}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  <span>Send us a Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </AnimatedCard>

            {/* Contact Information */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <AnimatedCard key={index} delay={400 + index * 100}>
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full gradient-primary">
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{info.title}</h3>
                      <p className="text-foreground font-medium">{info.content}</p>
                      <p className="text-muted-foreground text-sm">{info.description}</p>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Frequently Asked{" "}
              <span className="gradient-primary bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Quick answers to common questions about MultiMail
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: "How many Gmail accounts can I manage?",
                a: "You can manage unlimited Gmail accounts with MultiMail. Our platform is designed to scale with your needs."
              },
              {
                q: "Is my data secure?",
                a: "Yes! We use enterprise-grade encryption and security measures to protect your email data and privacy."
              },
              {
                q: "Do you offer customer support?",
                a: "Absolutely! We provide 24/7 customer support via email and live chat to help with any questions."
              },
              {
                q: "Can I try MultiMail for free?",
                a: "Yes, we offer a free trial so you can experience all features before committing to a plan."
              }
            ].map((faq, index) => (
              <AnimatedCard key={index} delay={index * 100}>
                <h3 className="text-lg font-semibold mb-2 text-primary">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Our team is here to help. Don't hesitate to reach out with any questions or concerns.
          </p>
          <Button variant="secondary" size="lg">
            Schedule a Call
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Contact;