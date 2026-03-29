import { Search, Trophy } from "lucide-react";
import { useState } from "react";
import type { StudentResult } from "../backend";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useActor } from "../hooks/useActor";

export default function ResultsPage() {
  const { actor } = useActor();
  const [rollNumber, setRollNumber] = useState("");
  const [results, setResults] = useState<StudentResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !rollNumber.trim()) return;
    setLoading(true);
    try {
      const res = await actor.searchResultsByRollNumber(rollNumber.trim());
      setResults(res);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Results</h1>
          <p className="text-blue-200 mt-2">
            Search your academic results using your roll number
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              Search Results
            </h2>
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                placeholder="Enter your roll number..."
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={loading || !rollNumber.trim()}
                className="bg-blue-700 hover:bg-blue-800"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? "Searching..." : "Search"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {searched && results.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>
              No results found for roll number <strong>{rollNumber}</strong>
            </p>
            <p className="text-sm mt-1">
              Please check the roll number and try again.
            </p>
          </div>
        )}

        {results.map((result) => (
          <Card key={result.id.toString()} className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
                <div>
                  <h3 className="text-xl font-bold text-blue-900">
                    {result.studentName}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Roll No: {result.rollNumber} | Class: {result.studentClass}{" "}
                    | Year: {result.academicYear}
                  </p>
                </div>
                {result.blobId && (
                  <a
                    href={result.blobId.getDirectURL()}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View PDF
                  </a>
                )}
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="text-left p-2 font-semibold text-blue-900">
                      Subject
                    </th>
                    <th className="text-center p-2 font-semibold text-blue-900">
                      Marks
                    </th>
                    <th className="text-center p-2 font-semibold text-blue-900">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.subjects.map((s) => (
                    <tr key={s.subject} className="border-b last:border-0">
                      <td className="p-2 text-gray-700">{s.subject}</td>
                      <td className="p-2 text-center text-gray-700">
                        {s.marks.toString()}
                      </td>
                      <td className="p-2 text-center font-semibold text-blue-700">
                        {s.grade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
