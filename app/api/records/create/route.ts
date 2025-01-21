//  /app/api/records/create/route.ts
import { NextResponse } from "next/server";
import { addDoc, collection } from "firebase/firestore";
import { collectionName, db } from "@/app/utils/firebase";
import { StudyData } from "@/app/utils/studyData";

// **データ追加**
export async function POST(request: Request) {
  //POSTメソッドでデータ新規登録処理
  const body: StudyData = await request.json(); //登録データをStudyData型のオブジェクトとしてJSON形式でrequestに渡す

  if (!body.email || !body.title || body.time === undefined) {
    //リクエスト内容（body）のいずれかが空の場合は、エラーコード400でリターン
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    const studiesRef = collection(db, collectionName); //FirebaseSDKを利用して
    const docRef = await addDoc(studiesRef, body); // FirestoreDBにリクエスト内容を新規登録
    return NextResponse.json({ success: true }); //処理が終了すれば、successフラグをtrueでリターン
  } catch (error: unknown) {
    console.error("Error fetching studies:", error);
    return NextResponse.json(
      //エラーの場合はsuccessをfalseとして、エラーメッセージ、status500をリターン
      {
        success: false,
        error: (error as Error).message || "Unknown error occurred", // error.messgaeはError型もしくは、unkownとして処理
      },
      { status: 500 }
    );
  }
}
