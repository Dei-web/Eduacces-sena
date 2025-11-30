import { Card } from "./ui/card";
import { MoreVertical } from "lucide-react";
import { Button } from "./ui/button";

export default function PrincipalCardWelcome() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-full">
      {/* Card 1 - Students */}
      <Card className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative">
        <div className="flex items-start justify-between mb-6">
          <div className="text-sm font-medium text-gray-600">Alumnos</div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-gray-100"
          >
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
        <div className="text-4xl font-bold text-gray-900">5,909</div>
      </Card>

      {/* Card 2 - Teachers */}
      <Card className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative">
        <div className="flex items-start justify-between mb-6">
          <div className="text-sm font-medium text-gray-600">profesores</div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-gray-100"
          >
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
        <div className="text-4xl font-bold text-gray-900">60</div>
      </Card>

      {/* Card 3 - Employees */}
      <Card className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative">
        <div className="flex items-start justify-between mb-6">
          <div className="text-sm font-medium text-gray-600">Carreras</div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-gray-100"
          >
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
        <div className="text-4xl font-bold text-gray-900">100</div>
      </Card>

      {/* Card 4 - Courses */}
      <Card className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative">
        <div className="flex items-start justify-between mb-6">
          <div className="text-sm font-medium text-gray-600">Fichas</div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-gray-100"
          >
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
        <div className="text-4xl font-bold text-gray-900">5</div>
      </Card>
    </div>
  );
}
