import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Scale, Code, Heart, Globe } from "lucide-react";

const Copyright = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-xs px-3 py-1">
          <Scale className="h-3 w-3 mr-1" />
          Legal Information
        </Badge>
        <h1 className="text-4xl font-bold">Copyright & Licensing</h1>
        <p className="text-muted-foreground">
          Information about intellectual property, licensing, and usage rights
        </p>
      </div>

      {/* Main Copyright Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Copyright Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
            <p className="font-medium">© 2025 ICP Security Scanner Project</p>
            <p className="text-sm text-muted-foreground mt-2">
              All rights reserved. This project was developed for the ICP25 Hackathon and is 
              protected by applicable intellectual property laws.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Open Source License */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Open Source License
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            ICP Security Scanner is committed to open source development and community collaboration.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">MIT License</h3>
              <p className="text-sm text-muted-foreground">
                The core platform code is licensed under the MIT License, allowing for 
                wide adoption and contribution.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Community Driven</h3>
              <p className="text-sm text-muted-foreground">
                We encourage community contributions, bug reports, and feature suggestions 
                through our open development process.
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">License Text (Preview)</h4>
            <div className="text-xs text-blue-700 font-mono bg-blue-100 p-3 rounded">
              <p>Permission is hereby granted, free of charge, to any person obtaining a copy</p>
              <p>of this software and associated documentation files (the "Software"), to deal</p>
              <p>in the Software without restriction, including without limitation the rights</p>
              <p>to use, copy, modify, merge, publish, distribute, sublicense, and/or sell</p>
              <p>copies of the Software...</p>
              <p className="mt-2 text-blue-600">[Full license available in repository]</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Third-Party Components */}
      <Card>
        <CardHeader>
          <CardTitle>Third-Party Components & Attribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This project makes use of various open source libraries and components:
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">UI & Design</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Tailwind CSS - MIT License</li>
                <li>• Radix UI - MIT License</li>
                <li>• Lucide Icons - ISC License</li>
                <li>• Shadcn/ui - MIT License</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Blockchain & Backend</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Internet Computer SDK - Apache 2.0</li>
                <li>• React - MIT License</li>
                <li>• TypeScript - Apache 2.0</li>
                <li>• Supabase - Apache 2.0</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Rights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Usage Rights & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-green-600">✅ You May</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use the platform for personal security analysis</li>
                <li>• Contribute to the open source codebase</li>
                <li>• Share scan results and security information</li>
                <li>• Integrate with our public APIs (when available)</li>
                <li>• Fork and modify the code under license terms</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-red-600">❌ You May Not</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use our branding without permission</li>
                <li>• Create competing services using our data</li>
                <li>• Reverse engineer proprietary algorithms</li>
                <li>• Redistribute without proper attribution</li>
                <li>• Use for illegal or harmful activities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Rights */}
      <Card>
        <CardHeader>
          <CardTitle>Data & Content Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">User-Generated Content</h4>
              <p className="text-sm text-muted-foreground">
                Comments, votes, and scan submissions remain the intellectual property of their creators. 
                By contributing, you grant us a license to use this content to improve platform security.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Security Data</h4>
              <p className="text-sm text-muted-foreground">
                Aggregated security intelligence and threat patterns may be shared with the community 
                and security researchers to enhance overall crypto ecosystem safety.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Research & Academia</h4>
              <p className="text-sm text-muted-foreground">
                Anonymous, aggregated data may be made available for legitimate security research 
                and academic studies with proper attribution.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact for Licensing */}
      <Card>
        <CardHeader>
          <CardTitle>Licensing Inquiries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            For questions about licensing, commercial use, or special permissions:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Code className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium text-sm">Development Team</p>
              <p className="text-xs text-muted-foreground">GitHub Issues</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Scale className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium text-sm">Legal Inquiries</p>
              <p className="text-xs text-muted-foreground">Platform Contact</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Heart className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium text-sm">Community</p>
              <p className="text-xs text-muted-foreground">Discord Server</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            This project is built with ❤️ for the crypto community and powered by the 
            Internet Computer Protocol (ICP) blockchain.
          </p>
          <Badge variant="secondary" className="mt-2">
            ICP25 Hackathon 2025
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default Copyright;