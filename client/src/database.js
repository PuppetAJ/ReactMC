import { openDB } from "idb";
import "regenerator-runtime/runtime";

export const initdb = async () => {
	openDB("contact_db", 1, {
		upgrade(db) {
			if (db.objectStoreNames.contains("contacts")) {
				console.log("storage already exists");
				return;
			}
			db.createObjectStore("contacts", { keyPath: "id", autoincrement: true });
			console.log("storage created");
		},
	});
};
