import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { useActor } from "../hooks/useActor";
import { sampleStaff } from "../lib/sampleData";

export default function AboutPage() {
  const { actor } = useActor();

  const { data: staff = [] } = useQuery({
    queryKey: ["staff"],
    queryFn: () => actor!.getStaffMembers(),
    enabled: !!actor,
  });

  const displayStaff = staff.length > 0 ? staff : sampleStaff;

  return (
    <div>
      {/* Page Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">About Us</h1>
          <p className="text-blue-200 mt-2">
            Learn about our school's history, mission, and dedicated team
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* School History */}
        <section>
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Our History</h2>
          <div className="bg-blue-50 rounded-xl p-6 text-gray-700 leading-relaxed">
            <p>
              Founded in <strong>2001</strong>, Buddha Deep English Boarding
              School was established with a vision to provide quality
              English-medium education to children of Lumbini Zone, Nepal.
              Located in the sacred land of Lumbini — the birthplace of Lord
              Buddha — our school draws inspiration from the values of wisdom,
              compassion, and enlightenment.
            </p>
            <p className="mt-4">
              Over more than two decades, the school has grown from a small
              institution to a recognized center of learning with hundreds of
              students from Grade 1 to Grade 12. We are affiliated with the
              <strong> National Examinations Board (NEB)</strong> and offer both
              SEE level (Grade 9-10) and +2 level (Grade 11-12) programs.
            </p>
            <p className="mt-4">
              Today, Buddha Deep English Boarding School stands as a beacon of
              quality education in the Lumbini region, producing graduates who
              excel academically and contribute positively to society.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section>
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Mission & Vision
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-t-4 border-blue-600">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  Our Mission
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  To provide quality education rooted in Buddhist values and
                  modern academic excellence, nurturing well-rounded individuals
                  who are equipped with knowledge, skills, and strong moral
                  character to face the challenges of the modern world.
                </p>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-teal-600">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">🌟</div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  Our Vision
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  To be a leading educational institution in Nepal that empowers
                  students with knowledge, character, and compassion — creating
                  responsible citizens who contribute meaningfully to society
                  and uphold the values of the Buddha's teachings.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Our Core Values
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: "📚",
                title: "Academic Excellence",
                desc: "Highest standards of learning",
              },
              {
                icon: "🧘",
                title: "Mindfulness",
                desc: "Buddhist values and meditation",
              },
              {
                icon: "🤝",
                title: "Compassion",
                desc: "Care for fellow beings",
              },
              {
                icon: "🏅",
                title: "Integrity",
                desc: "Honesty and strong character",
              },
            ].map((v) => (
              <Card
                key={v.title}
                className="text-center hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="text-3xl mb-2">{v.icon}</div>
                  <h4 className="font-semibold text-blue-900 text-sm">
                    {v.title}
                  </h4>
                  <p className="text-gray-500 text-xs mt-1">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Staff */}
        <section>
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Our Staff</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {displayStaff.map((member) => (
              <Card
                key={member.id.toString()}
                className="text-center hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3 overflow-hidden">
                    {member.blobId ? (
                      <img
                        src={member.blobId.getDirectURL()}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-blue-400" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 text-xs mt-1">
                    {member.designation}
                  </p>
                  <p className="text-gray-500 text-xs mt-2 line-clamp-3">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Affiliation */}
        <section className="bg-blue-900 text-white rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Affiliation & Recognition</h2>
          <div className="flex flex-wrap justify-center gap-8 text-blue-200">
            <div>
              <div className="font-bold text-white text-lg">NEB</div>
              <div className="text-sm">National Examinations Board</div>
            </div>
            <div>
              <div className="font-bold text-white text-lg">Grade 1–12</div>
              <div className="text-sm">Basic to Higher Secondary</div>
            </div>
            <div>
              <div className="font-bold text-white text-lg">2001</div>
              <div className="text-sm">Year Established</div>
            </div>
            <div>
              <div className="font-bold text-white text-lg">English Medium</div>
              <div className="text-sm">Language of Instruction</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
