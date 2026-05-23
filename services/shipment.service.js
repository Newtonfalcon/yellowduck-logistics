import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";

export async function createShipment(data) {
  return await addDoc(
    collection(db, "shipments"),
    {
      ...data,

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp(),
    }
  );
}