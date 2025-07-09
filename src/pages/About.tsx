import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  Zap, 
  Globe, 
  Award,
  Heart,
  Code,
  Target,
  Lightbulb
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Shield,
      title: "Advanced Security Analysis",
      description: "State-of-the-art algorithms analyze blockchain transactions, smart contracts, and wallet behaviors to detect potential threats."
    },
    {
      icon: Users,
      title: "Community-Driven Intelligence",
      description: "Harness the collective wisdom of the crypto community with user reports, votes, and collaborative threat detection."
    },
    {
      icon: Zap,
      title: "Real-Time Scanning",
      description: "Instant analysis of wallet addresses, token contracts, and DApps with results delivered in seconds."
    },
    {
      icon: Globe,
      title: "Decentralized Infrastructure",
      description: "Built on the Internet Computer Protocol (ICP) for maximum security, transparency, and censorship resistance."
    }
  ];

  const teamValues = [
    {
      icon: Target,
      title: "Mission",
      description: "To make the crypto ecosystem safer for everyone by providing accessible, reliable security tools powered by community intelligence."
    },
    {
      icon: Lightbulb,
      title: "Vision",
      description: "A future where crypto users can transact with confidence, knowing they have the tools and community support to identify and avoid threats."
    },
    {
      icon: Heart,
      title: "Values",
      description: "Transparency, community collaboration, innovation, and the belief that security should be accessible to all crypto users."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="text-xs px-3 py-1">
          ICP25 Hackathon Project
        </Badge>
        <h1 className="text-4xl font-bold">About ICP Security Scanner</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A revolutionary blockchain security platform that combines advanced threat detection 
          with community-driven intelligence to protect crypto users from scams and malicious activity.
        </p>
      </div>

      {/* What We Do */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">What We Do</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            ICP Security Scanner is a comprehensive security platform designed to protect cryptocurrency 
            users from scams, fraudulent addresses, and malicious smart contracts. Our platform leverages 
            cutting-edge technology and community intelligence to provide real-time threat assessment 
            and risk analysis.
          </p>
          <p className="text-muted-foreground">
            Whether you're a DeFi enthusiast, NFT collector, or casual crypto user, our tools help you 
            make informed decisions about which addresses, tokens, and applications you can trust.
          </p>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Our Purpose</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamValues.map((value) => (
            <Card key={value.title} className="text-center">
              <CardContent className="p-6">
                <value.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Built on Internet Computer Protocol</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Our platform is built on the Internet Computer Protocol (ICP), providing several key advantages:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">🔒 Enhanced Security</h4>
              <p className="text-sm text-muted-foreground">
                Decentralized infrastructure with cryptographic security guarantees
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">⚡ High Performance</h4>
              <p className="text-sm text-muted-foreground">
                Sub-second query times and real-time data processing
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">🌍 Global Accessibility</h4>
              <p className="text-sm text-muted-foreground">
                Accessible worldwide without traditional cloud dependencies
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">💚 Sustainable</h4>
              <p className="text-sm text-muted-foreground">
                Energy-efficient consensus mechanism with minimal environmental impact
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Contribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Community-Powered Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Our platform thrives on community participation. Users contribute by:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">🗳️ Voting on Scans</h4>
              <p className="text-sm text-muted-foreground">
                Community members vote on scan results to improve accuracy and build consensus
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">💬 Sharing Insights</h4>
              <p className="text-sm text-muted-foreground">
                Users comment on scans to share experiences and additional context
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">🚨 Reporting Threats</h4>
              <p className="text-sm text-muted-foreground">
                Quick reporting of new scams and suspicious addresses helps protect others
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">📊 Data Contribution</h4>
              <p className="text-sm text-muted-foreground">
                Anonymous scan data helps improve our threat detection algorithms
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Get Involved</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Join our community and help make the crypto ecosystem safer for everyone.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">GitHub: Coming Soon</Badge>
            <Badge variant="secondary">Discord: Coming Soon</Badge>
            <Badge variant="secondary">Twitter: Coming Soon</Badge>
            <Badge variant="secondary">Telegram: Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;