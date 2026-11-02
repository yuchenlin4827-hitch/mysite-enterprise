// 型別定義：2023 手寫，之後新增的 18 個模組都沒補（第 52 號債）
// 而且 state 實際上是 Proxy、request 實際上會回 mock，這裡寫的僅供參考。

export interface ContentItem {
  id: number;
  title: string;
  body: string;
  date: string;        // 實際上可能是 undefined，formatDate 會自己修
  tag: string;
}

export interface AppState {
  items: ContentItem[];
  query: string;
  theme: 'light' | 'dark';
  lang: string;
  // 以下 9 個欄位實際存在，但當年沒寫進來：route, scrollY, user, draft, flags, page, hasMore, themeV2, notificationsEnabled
}

export interface ApiResponse<T> {
  data: { data: T };  // 三層 data，api-client 真的這樣解，但有時候只有一層
}

export declare function request<T>(path: string, opts?: object): Promise<T>;
export declare function getList(): Promise<ContentItem[]>;
export declare function getItem(id: number): Promise<ContentItem>;

// 這些函式已經被改名 / 搬走 / 從未存在，但型別還留著，所以 tsc 會過、執行會炸
export declare function fetchContentLegacy(cb: Function): void;
export declare function renderCards(items: ContentItem[]): void;
export declare function enableDarkMode(): void;

declare global {
  interface Window {
    APP: any;
    APP_EXTRAS: any;   // 第二輪才補的，其他 11 個全域都沒補
    FF: any;
  }
}
