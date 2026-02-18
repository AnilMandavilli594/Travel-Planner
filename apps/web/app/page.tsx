"use client";
import {gql} from "@apollo/client"
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";

type Trip = {
  id: string;
  title: string;
};

type GetTripsResponse = {
  trips: Trip[];
};

type CreateTripResponse = {
  createTrip: Trip;
};

type CreateTripVariables = {
  title: string;
  ownerId: string;
};


const GET_TRIPS = gql`
  query {
    trips {
      id
      title
    }
  }
`;

const CREATE_TRIP = gql`
  mutation CreateTrip($title: String!, $ownerId: String!) {
    createTrip(title: $title, ownerId: $ownerId) {
      id
      title
    }
  }
`;

export default function Home() {
const { data, loading, refetch } = useQuery<GetTripsResponse>(GET_TRIPS);
const [createTrip] = useMutation<CreateTripResponse, CreateTripVariables>(CREATE_TRIP);

  const [title, setTitle] = useState("");

  const handleCreate = async () => {
    await createTrip({
      variables: {
        title,
        ownerId: "user-123",
      },
    });

    setTitle("");
    refetch();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Trips</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Trip title"
      />
      <button onClick={handleCreate}>Create</button>

      <ul>
        {data?.trips.map((trip) => (
          <li key={trip.id}>{trip.title}</li>
        ))}
      </ul>
    </div>
  );
}
