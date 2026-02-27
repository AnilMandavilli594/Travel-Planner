"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

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
  mutation CreateTrip($title: String!) {
    createTrip(title: $title) {
      id
      title
    }
  }
`;

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const {
    data,
    loading: tripsLoading,
    error: tripsError,
    refetch,
  } = useQuery<GetTripsResponse>(GET_TRIPS, {
    skip: !user,
  });

  const [createTrip] =
    useMutation<CreateTripResponse, CreateTripVariables>(CREATE_TRIP);

  const handleCreate = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    await createTrip({
      variables: { title },
    });

    setTitle("");
    refetch();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Trips</h1>
        <p>
          <Link href="/login">Login</Link> to view and create trips.
        </p>
      </div>
    );
  }

  if (tripsLoading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Trips</h1>
      <p>
        Signed in as {user.email ?? user.id}{" "}
        <button onClick={handleLogout}>Logout</button>
      </p>

      {tripsError ? <p>{tripsError.message}</p> : null}

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Trip title"
      />

      <button onClick={handleCreate}>Create</button>

      <ul>
        {data?.trips.map((trip) => (
          <li key={trip.id}>
            <a href={`/trip/${trip.id}`}>{trip.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
