//  /app/api/records/update/route.ts
import { NextResponse } from "next/server";
import { doc, updateDoc } from "firebase/firestore";
import { collectionName, db } from "@/app/utils/firebase";
import { StudyData } from "@/app/utils/studyData";

// **データ更新**
export async function PUT(request: Request) {//PUTメソッドでデータ更新処理
  const body: StudyData = await request.json();//更新データをStudyData型のオブジェクトとしてJSON形式でrequestに渡す

  if (!body.id || !body.email || !body.title || body.time === undefined) {//リクエスト内容（body）のいずれかが空の場合は、エラーコード400でリターン
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    const docRef = doc(db, collectionName, body.id); //FirebaseSDKを利用して
    await updateDoc(docRef, { title: body.title, time: body.time }); // FirestoreDBのリクエスト内容、更新処理
    return NextResponse.json({ success: true }); //処理が終了すれば、successフラグをtrueでリターン
  } catch (error: unknown) {
    console.error("Error fetching studies:", error);
    return NextResponse.json(//エラーの場合はsuccessをfalseとして、エラーメッセージ、status500をリターン
      {
        success: false,
        error: (error as Error).message || "Unknown error occurred",// error.messgaeはError型もしくは、unkownとして処理
      },
      { status: 500 }
    );
  }
}