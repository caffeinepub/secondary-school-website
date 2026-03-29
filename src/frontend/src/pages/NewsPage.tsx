import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { useActor } from "../hooks/useActor";
import { formatDate, sampleNews } from "../lib/sampleData";

export default function NewsPage() {
  const { actor } = useActor();

  const { data: news = [], isLoading } = useQuery({
    queryKey: ["publishedNews"],
    queryFn: () => actor!.getPublishedNewsEvents(),
    enabled: !!actor,
  });

  const displayNews = news.length > 0 ? news : sampleNews;

  return (
    <div>
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">News & Events</h1>
          <p className="text-blue-200 mt-2">
            Stay updated with the latest happenings at our school
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center text-gray-400 py-16">Loading news...</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayNews.map((item) => (
              <Card
                key={item.id.toString()}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-blue-200 to-teal-200 flex items-center justify-center">
                  {item.blobId ? (
                    <img
                      src={item.blobId.getDirectURL()}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Calendar className="w-16 h-16 text-blue-400" />
                  )}
                </div>
                <CardContent className="p-5">
                  <p className="text-xs text-gray-400 mb-2">
                    {formatDate(item.date)}
                  </p>
                  <h3 className="font-bold text-blue-900 text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
