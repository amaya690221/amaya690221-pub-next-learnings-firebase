//  /app/api/records/delete/route.ts
import { NextResponse } from "next/server";
import { deleteDoc, doc } from "firebase/firestore";
import { collectionName, db } from "@/app/utils/firebase";
import { StudyData } from "@/app/utils/studyData";

// **データ削除**
export async function DELETE(request: Request) {
  //DELETEメソッドでデータ削除処理
  const body: StudyData = await request.json(); //削除データをStudyData型のオブジェクトとしてJSON形式でrequestに渡す

  if (!body.id) {
    //削除対象データのid（body.id）が空の場合は、エラーコード400でリターン
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const docRef = doc(db, collectionName, body.id); //FirebaseSDKを利用して
    await deleteDoc(docRef); // FirestoreDBの対象idのデータを削除
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
