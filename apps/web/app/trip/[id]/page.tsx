"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";

const GET_TRIP = gql`
  query GetTrip($id: ID!) {
    trip(id: $id) {
      id
      title
    }
  }
`;

export default function TripPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, loading, error } = useQuery(GET_TRIP, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  if (!data?.trip) return <p>Trip not found</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>{data.trip.title}</h1>
      <p>Trip ID: {data.trip.id}</p>
    </div>
  );
}