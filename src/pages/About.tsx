import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Users, Target, Heart, Award, Lightbulb } from "lucide-react";
import AnimatedCard from "@/components/AnimatedCard";
import aboutImage from "@/assets/about-team.jpg";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Mission Focused",
      description: "We're dedicated to simplifying email management for professionals worldwide"
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Every feature we build is designed with our users' needs and feedback in mind"
    },
    {
      icon: Heart,
      title: "Passionate Team",
      description: "Our team is passionate about creating the best email management experience"
    },
    {
      icon: Award,
      title: "Quality First",
      description: "We never compromise on quality, security, or user experience"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We continuously innovate to stay ahead of email management challenges"
    },
    {
      icon: CheckCircle,
      title: "Reliability",
      description: "Our platform is built to be reliable, secure, and always available"
    }
  ];

  const features = [
    "Manage unlimited Gmail accounts",
    "Advanced email filtering and organization",
    "Bulk email operations",
    "Real-time synchronization",
    "Enterprise-grade security",
    "24/7 customer support"
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h1 className="text-5xl font-bold mb-6">
                About{" "}
                <span className="gradient-hero bg-clip-text text-transparent">
                  MultiMail
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                We're revolutionizing how professionals manage multiple Gmail accounts. 
                Our platform combines powerful features with an intuitive interface to 
                make email management effortless and efficient.
              </p>
              <div className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
            
            <div className="animate-slide-in-right">
              <img 
                src={aboutImage} 
                alt="Our Team" 
                className="rounded-2xl shadow-floating w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Our{" "}
              <span className="gradient-primary bg-clip-text text-transparent">
                Core Values
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These values guide everything we do and shape the experience we create for our users
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <AnimatedCard key={index} delay={index * 100} className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 rounded-full gradient-primary inline-flex">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedCard className="text-center">
              <h2 className="text-4xl font-bold mb-8">
                Our{" "}
                <span className="gradient-hero bg-clip-text text-transparent">
                  Story
                </span>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  MultiMail was born from a simple frustration: managing multiple Gmail accounts 
                  was inefficient and time-consuming. As digital professionals, we found ourselves 
                  constantly switching between accounts, missing important emails, and struggling 
                  to maintain organization across different inboxes.
                </p>
                <p>
                  We decided to build the solution we wished existed. After months of development 
                  and testing with real users, MultiMail emerged as a comprehensive platform that 
                  transforms how professionals handle multiple email accounts.
                </p>
                <p>
                  Today, thousands of users trust MultiMail to streamline their email workflows, 
                  increase productivity, and never miss an important message again. We're just 
                  getting started on our mission to make email management effortless for everyone.
                </p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience MultiMail?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community of professionals who have transformed their email workflow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/dashboard">Try Dashboard</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;