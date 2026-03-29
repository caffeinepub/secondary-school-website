import { useQuery } from "@tanstack/react-query";
import { Image } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { useActor } from "../hooks/useActor";
import { formatDate } from "../lib/sampleData";

export default function GalleryPage() {
  const { actor } = useActor();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => actor!.getGalleryItems(),
    enabled: !!actor,
  });

  return (
    <div>
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-blue-200 mt-2">
            Photos and videos from school events and activities
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center text-gray-400 py-16">
            Loading gallery...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Image className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            <p className="text-lg">No gallery items yet.</p>
            <p className="text-sm mt-1">
              Photos and videos will appear here once uploaded by admin.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <Card
                key={item.id.toString()}
                className="overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="h-44 bg-blue-100 overflow-hidden">
                  {item.mediaType === "video" ? (
                    // biome-ignore lint/a11y/useMediaCaption: gallery video
                    <video
                      src={item.blobId.getDirectURL()}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={item.blobId.getDirectURL()}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <CardContent className="p-3">
                  <p className="font-medium text-sm text-gray-800">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(item.date)}
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
