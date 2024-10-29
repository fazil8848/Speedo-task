import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

export default function Trips() {
  const trips = Array.from(
    { length: 50 },
    (_, index) => `Bangalore - Mysore ${index + 1}`
  );
  const tripsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(trips.length / tripsPerPage);
  const startIndex = (currentPage - 1) * tripsPerPage;
  const currentTrips = trips.slice(startIndex, startIndex + tripsPerPage);

  return (
    <div className="bg-gray-100">
      
    </div>
  );
}
