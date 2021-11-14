interface MyappListResponse {
  obj: { appList: MyAppItem[]; contextData: string };
}

interface SearchMyappResponse {
  obj?: {
    dataList: {
      type: number;
      appInfo: MyAppItem;
    }[];
    contextData: string;
  };
}

interface MyappDetailResponse {
  obj: { appInfo: MyAppItem };
}

interface MyAppItem {
  description: string | null;
  flag: number;
  fileSize: number;
  authorId: number;
  categoryId: number;
  apkMd5: string;
  categoryName: string;
  apkUrl: string;
  appDownCount: number;
  appId: number;
  appName: string;
  authorName: string;
  iconUrl: string;
  newFeature: string;
  pkgName: string;
  versionCode: number;
  versionName: string;
  averageRating: number;
  editorIntro: string;
  screenshots: string[];
  apkPublishTime: 1635495951;
  appRatingInfo: {
    averageRating: number;
    ratingCount: number;
    ratingDistribution: number[];
  };
  snapshotsUrl: string | null;
  appTags: string | null;
}
