"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

type Trip = {
  id: string;
  title: string;
  content: string;
};

type GetTripResponse = {
  trip: Trip | null;
};

type GetTripVariables = {
  id: string;
};

type UpdateTripResponse = {
  updateTripContent: {
    id: string;
    content: string;
  };
};

type UpdateTripVariables = {
  id: string;
  content: string;
};

const TripEditor = dynamic(
  () => import("../../../components/TripEditor"),
  { ssr: false }
);

const GET_TRIP = gql`
  query GetTrip($id: ID!) {
    trip(id: $id) {
      id
      title
      content
    }
  }
`;

const UPDATE_TRIP = gql`
  mutation UpdateTrip($id: ID!, $content: String!) {
    updateTripContent(id: $id, content: $content) {
      id
      content
    }
  }
`;

export default function TripPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, loading } = useQuery<GetTripResponse, GetTripVariables>(
    GET_TRIP,
    {
    variables: { id },
    }
  );

  const [updateTrip] = useMutation<UpdateTripResponse, UpdateTripVariables>(
    UPDATE_TRIP
  );

  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (data?.trip) {
      setContent(data.trip.content ?? "");
    }
  }, [data]);

  useEffect(() => {
    if (!data?.trip) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setSaving(true);

      await updateTrip({
        variables: { id, content },
      });

      setSaving(false);
    }, 800); // debounce 800ms

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content]);

  if (loading) return <p>Loading...</p>;
  if (!data?.trip) return <p>Not found</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>{data.trip.title}</h1>

        <TripEditor content={content} onChange={setContent} />

      <div style={{ marginTop: "10px", fontSize: "14px", color: "gray" }}>
        {saving ? "Saving..." : "Saved"}
      </div>
    </div>
  );
}
