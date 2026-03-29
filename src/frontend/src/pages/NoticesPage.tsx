import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { useActor } from "../hooks/useActor";
import { formatDate, sampleNotices } from "../lib/sampleData";

export default function NoticesPage() {
  const { actor } = useActor();

  const { data: notices = [], isLoading } = useQuery({
    queryKey: ["publishedNotices"],
    queryFn: () => actor!.getPublishedNotices(),
    enabled: !!actor,
  });

  const displayNotices = notices.length > 0 ? notices : sampleNotices;

  return (
    <div>
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Notice Board</h1>
          <p className="text-blue-200 mt-2">
            Important announcements and updates from the school
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center text-gray-400 py-16">
            Loading notices...
          </div>
        ) : (
          <div className="space-y-4">
            {displayNotices.map((notice) => (
              <Card
                key={notice.id.toString()}
                className="border-l-4 border-blue-600 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 text-lg">
                        {notice.title}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1 mb-3">
                        {formatDate(notice.date)}
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        {notice.body}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
