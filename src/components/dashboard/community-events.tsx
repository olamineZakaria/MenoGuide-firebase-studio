import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const events = [
  {
    title: "Mindful Menopause Workshop",
    date: "October 26, 2024",
    description: "Join us for a workshop on mindfulness techniques to manage stress.",
    imageHint: "workshop yoga"
  },
  {
    title: "Nutrition for Menopause Webinar",
    date: "November 12, 2024",
    description: "Learn about the best foods to support your body during menopause.",
    imageHint: "healthy food"
  },
  {
    title: "Local Meetup: Walk & Talk",
    date: "November 18, 2024",
    description: "Connect with others in your community for a refreshing walk.",
    imageHint: "women walking"
  },
];

export function CommunityEvents() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Community Events</CardTitle>
        <CardDescription>Connect, learn, and grow with others.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {events.map((event, index) => (
            <div key={index} className="flex items-start gap-4 group">
                <Image src={`https://placehold.co/200x200.png`} alt={event.title} width={80} height={80} className="rounded-lg object-cover" data-ai-hint={event.imageHint} />
              <div className="flex-1">
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-muted-foreground">{event.date}</p>
                <p className="text-sm mt-1">{event.description}</p>
                <Button variant="link" className="p-0 h-auto text-sm mt-1">
                    Learn More <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
