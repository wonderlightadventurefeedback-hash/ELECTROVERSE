
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-16">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="font-headline text-5xl font-bold">Contact Our Department</h1>
        <p className="text-muted-foreground text-lg">
          Have questions about our programs or research? We are here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border">
            <CardContent className="p-8 space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-xl text-secondary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Office Location</h4>
                  <p className="text-sm text-muted-foreground">Electrical Block A, 3rd Floor<br />SparkLux Tech Campus</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-xl text-secondary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Phone Enquiries</h4>
                  <p className="text-sm text-muted-foreground">+1 (555) 012-3456<br />Mon-Fri, 9am - 5pm</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-xl text-secondary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Email Support</h4>
                  <p className="text-sm text-muted-foreground">admissions@sparklux.edu<br />admin@sparklux.edu</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-xl text-secondary">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Department Hours</h4>
                  <p className="text-sm text-muted-foreground">Office: 9:00 - 17:00<br />Lab Access: 08:00 - 20:00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-card border-border shadow-2xl">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="font-headline text-2xl">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input placeholder="John Doe" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input placeholder="john@example.com" className="bg-background border-border" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input placeholder="Academic Inquiry" className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea placeholder="How can we help you today?" className="min-h-[150px] bg-background border-border" />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 py-6 text-lg accent-glow">
                Send Inquiry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
