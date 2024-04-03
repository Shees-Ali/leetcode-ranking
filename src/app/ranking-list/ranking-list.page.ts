import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NetworkService } from '../services/network.service';
import { Table } from 'primeng/table';
import { DatabaseService } from '../services/database.service';
import { LeetCodeProfile } from '../interfaces/LeetCodeProfile';

@Component({
  selector: 'app-ranking-list',
  templateUrl: './ranking-list.page.html',
  styleUrls: ['./ranking-list.page.scss'],
})
export class RankingListPage implements OnInit {
  profiles_list: any[] = [];
  profiles: any[] = [];
  isLoading: boolean = false;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('fileSelector', { static: false }) file_selector!: ElementRef;

  constructor(
    public networkService: NetworkService,
    public database: DatabaseService
  ) {}

  ngOnInit(): void {
    this.init();
  }

  async init() {
    const val: any = await this.database.getUpdateTime();
    const lastUpdated = new Date(val).getTime();
    if (lastUpdated) {
      const currentTime = new Date().getTime();
      const diff = currentTime - lastUpdated;
      const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000;
      if (diff > twelveHoursInMilliseconds) {
        this.syncFromDB();
      } else {
        this.getProfiles();
      }
    } else {
      this.syncFromDB();
    }
  }

  async getProfiles() {
    const latestProfile = await this.database.getLatestProfile();
    if (latestProfile) {
      let profiles = await this.database.getProfiles();
      profiles = profiles?.filter(
        (profile) => profile['username'] !== 'undefined'
      ) as LeetCodeProfile[];
      this.profiles = profiles as any[];
    } else {
      this.syncFromDB();
    }
  }

  async syncFromDB() {
    this.isLoading = true;
    let profiles = await this.database.getProfilesFromDB();
    profiles = profiles?.filter(
      (profile) => profile['username'] !== 'undefined'
    );
    await this.database.storeProfiles(profiles);
    await this.database.setUpdateTime();
    this.profiles = profiles as any[];
    this.isLoading = false;
  }

  async syncProfilesToFirebase() {
    this.isLoading = true;

    const maxConcurrentRequests = 10; // Adjust as needed
    let activeRequests = 0;
    const profiles: any = [];

    const fetchNextProfile = async () => {
      if (
        activeRequests < maxConcurrentRequests &&
        this.profiles_list.length > 0
      ) {
        activeRequests++;
        const profile = this.profiles_list.shift();
        const profile_name = profile['LeetCode Profile Link'].split('/')[3];

        try {
          if (
            profile_name === 'profile' ||
            profile_name === 'undefined' ||
            profile_name === 'problemset' ||
            profile_name === 'list'
          ) {
            throw new Error('Invalid profile name');
          }

          const data = await this.networkService.getProfileData(profile_name);
          data['roll_no'] = profile['Roll No'];
          data['programme'] = profile['Programme'];
          data['batch'] = profile['Batch'];
          profiles.push(data);
        } catch (error) {
          // Handle any errors fetching profile data
          console.error('Error fetching profile:', error);
        } finally {
          activeRequests--;
          fetchNextProfile(); // Fetch the next profile
        }
      } else if (this.profiles_list.length === 0) {
        // All profiles fetched
        await this.database.storeProfilesToFirebase(profiles);
        this.isLoading = false;
      }
    };

    fetchNextProfile(); // Start the initial fetch
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  import(event: any) {
    const files = event.target.files;
    this.database.parseCsv(files[0]).then((res) => {
      if (res) {
        alert('Data stored successfully');
      }
    });
  }

  openFileUpload() {
    const file_selection = this.file_selector.nativeElement;
    file_selection.click();
  }

  async sync() {
    const latestLink = await this.database.getLatestLeetCodeLink();
    if (latestLink) {
      const links = await this.database.getAllLeetCodeLinks();
      this.profiles_list = links;
      this.syncProfilesToFirebase();
    } else {
      console.log('No LeetCode links found in storage');
    }
  }

  syncCSVData() {
    this.database.storeDataToFirebase();
  }
}
