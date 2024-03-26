import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  writeBatch,
} from '@angular/fire/firestore';
import { LeetCodeProfile } from '../interfaces/LeetCodeProfile';
import { Student } from '../interfaces/Student';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  profilesCollection: string = 'profiles';
  csvDataCollection: string = 'csvData';
  private firestore: Firestore = inject(Firestore);

  async saveProfiles(profiles: LeetCodeProfile[]) {
    const batch = writeBatch(this.firestore);
    profiles.forEach((profile) => {
      const randomId = Math.random().toString(36).substring(2);
      const profileRef = doc(this.firestore, this.profilesCollection, randomId);
      batch.set(profileRef, profile);
    });

    await batch.commit();
  }

  async getProfiles() {
    return new Promise<LeetCodeProfile[]>((resolve, reject) => {
      const profiles: LeetCodeProfile[] = [];
      const querySnapshot = getDocs(
        collection(this.firestore, this.profilesCollection)
      );
      querySnapshot
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            profiles.push(doc.data() as LeetCodeProfile);
          });
          resolve(profiles);
        })
        .catch(reject);
    });
  }

  async saveCSVDATA(students: Student[]) {
    const batch = writeBatch(this.firestore);
    students.forEach((student) => {
      const randomId = Math.random().toString(36).substring(2);
      const studentRef = doc(this.firestore, this.csvDataCollection, randomId);
      batch.set(studentRef, student);
    });

    await batch.commit();
  }
}
