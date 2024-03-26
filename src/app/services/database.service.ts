import { Injectable } from '@angular/core';
import localforage from 'localforage';
import * as Papa from 'papaparse';
import { LeetCodeProfile } from '../interfaces/LeetCodeProfile';
import { FirebaseService } from './firebase.service';
import { Student } from '../interfaces/Student';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  dbName = 'student-data';
  storeName = 'students';
  profilesStoreName = 'profiles';

  private localForage: LocalForage;
  constructor(private firebaseService: FirebaseService) {
    this.localForage = localforage.createInstance({
      name: this.dbName,
      driver: localforage.INDEXEDDB,
    });
  }

  async parseCsv(file: File) {
    const reader = new FileReader();
    reader.readAsText(file);

    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        if (event.target) {
          console.log(event);
          const csvData = event.target.result as string;
          const parsedData = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
          });
          if (parsedData.errors.length > 0) {
            reject(new Error('Error parsing CSV file'));
            return;
          }

          const students: Student[] = parsedData.data as Student[];
          this.storeData(students)
            .then(() => resolve('Data stored successfully'))
            .catch(reject);
        }
      };

      reader.onerror = reject;
    });
  }

  async storeProfiles(profiles: LeetCodeProfile[]) {
    this.localForage.setItem(this.profilesStoreName, profiles);
  }

  async storeProfilesToFirebase(profiles: LeetCodeProfile[]) {
    this.firebaseService.saveProfiles(profiles);
  }

  async getProfilesFromDB() {
    return this.firebaseService.getProfiles();
  }

  async getProfiles(): Promise<LeetCodeProfile[] | null> {
    return (await this.localForage.getItem(this.profilesStoreName)) as
      | LeetCodeProfile[]
      | null;
  }

  async getLatestProfile(): Promise<LeetCodeProfile | null> {
    const profiles = (await this.getProfiles()) || [];
    return profiles.length > 0 ? profiles[profiles.length - 1] : null;
  }

  private async storeData(students: Student[]) {
    const links: Student[] = [];
    for (const student of students) {
      if (student['LeetCode Profile Link'] == 'https://leetcode.com/profile/account/') {
      console.log("Invalid LeetCode Profile Link")
      }

      if (
        student['LeetCode Profile Link'] !==
        'https://leetcode.com/profile/account/'
      ) {
        links.push(student);
      }
    }

    await this.localForage.setItem(this.storeName, links);
    return links;
  }

  async getLatestLeetCodeLink(): Promise<Student | null> {
    const links =
      ((await this.localForage.getItem(this.storeName)) as Student[]) || [];
    return links.length > 0 ? links[links.length - 1] : null;
  }

  async getAllLeetCodeLinks(): Promise<Student[]> {
    const links =
      ((await this.localForage.getItem(this.storeName)) as Student[]) || [];
    return links;
  }
}
