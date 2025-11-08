/**
 * OpenBD APIから取得した本の情報
 */
export interface OpenBDBookInfo {
  title: string;
  genre: string;
  totalPage: number;
  coverImage?: string;
  isbn?: string;
}

/**
 * OpenBD APIのレスポンス型
 */
interface OpenBDResponse {
  onix?: {
    DescriptiveDetail?: {
      TitleDetail?: {
        TitleElement?: {
          TitleText?: {
            content?: string;
          };
        };
      };
      Subject?: Array<{
        SubjectCode?: string;
        SubjectHeadingText?: string;
      }>;
      Extent?: Array<{
        ExtentType?: string;
        ExtentValue?: string;
      }>;
    };
    CollateralDetail?: {
      SupportingResource?: Array<{
        ResourceContent?: Array<{
          ResourceMode?: string;
          ResourceVersion?: Array<{
            ResourceLink?: string;
          }>;
        }>;
      }>;
    };
  };
  summary?: {
    isbn?: string;
    title?: string;
    cover?: string;
  };
}

/**
 * OpenBD APIから本の情報を取得する
 * @param isbn ISBNコード（10桁または13桁）
 * @returns 本の情報、取得できない場合はnull
 */
export async function fetchBookFromOpenBD(
  isbn: string
): Promise<OpenBDBookInfo | null> {
  try {
    // ISBNからハイフンを除去
    const cleanIsbn = isbn.replace(/-/g, "");

    // OpenBD APIを呼び出し
    const response = await fetch(
      `https://api.openbd.jp/v1/get?isbn=${encodeURIComponent(cleanIsbn)}`
    );

    if (!response.ok) {
      throw new Error(`OpenBD API error: ${response.status}`);
    }

    const data: OpenBDResponse[] = await response.json();

    if (!data || data.length === 0 || !data[0]) {
      return null;
    }

    const bookData = data[0];

    // タイトルを取得
    const title =
      bookData.onix?.DescriptiveDetail?.TitleDetail?.TitleElement?.TitleText
        ?.content ||
      bookData.summary?.title ||
      "";

    if (!title) {
      return null;
    }

    // ジャンルを取得（SubjectCodeまたはSubjectHeadingTextから推測）
    const subjects =
      bookData.onix?.DescriptiveDetail?.Subject || [];
    let genre = "magazine"; // デフォルト

    // ジャンルコードから推測
    for (const subject of subjects) {
      const code = subject.SubjectCode;
      if (code) {
        // 日本十進分類法（NDC）の分類コードから推測
        if (code.startsWith("0") || code.startsWith("1")) {
          genre = "philosophy"; // 哲学・思想
        } else if (code.startsWith("4")) {
          genre = "novel"; // 小説・文学
        } else if (code.startsWith("5") || code.startsWith("6")) {
          genre = "study"; // 技術書・実用書
        }
        break;
      }
    }

    // 総ページ数を取得
    const extents = bookData.onix?.DescriptiveDetail?.Extent || [];
    let totalPage = 0;

    for (const extent of extents) {
      if (extent.ExtentType === "11") {
        // 11はページ数を表す
        const pageValue = parseInt(extent.ExtentValue || "0", 10);
        if (pageValue > 0) {
          totalPage = pageValue;
          break;
        }
      }
    }

    // 表紙画像を取得
    const coverImage =
      bookData.summary?.cover ||
      bookData.onix?.CollateralDetail?.SupportingResource?.[0]?.ResourceContent?.[0]
        ?.ResourceVersion?.[0]?.ResourceLink ||
      undefined;

    return {
      title,
      genre,
      totalPage,
      coverImage,
      isbn: cleanIsbn,
    };
  } catch (error) {
    console.error("Failed to fetch book from OpenBD:", error);
    return null;
  }
}

