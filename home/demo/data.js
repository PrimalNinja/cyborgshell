api.print("START");

var arrData = [
	{ name: "John Doe", address: "123 Main St" },
	{ name: "Jane Doe", address: "456 Elm St" },
	{ name: "Bob Smith", address: "789 Oak St" },
	{ name: "Alice Johnson", address: "321 Maple St" },
	{ name: "Mike Brown", address: "901 Pine St" },
	{ name: "Emily Davis", address: "234 Cedar St" },
	{ name: "David Lee", address: "567 Spruce St" },
	{ name: "Alice Johnson", address: "321 Maple St" },
	{ name: "Sarah Taylor", address: "890 Walnut St" },
	{ name: "Bob Smith", address: "1 Smith St" },
	{ name: "Kevin White", address: "345 Hickory St" },
	{ name: "Rebecca Martin", address: "678 Cherry St" }
];

var arrData2 = [
	{ name: "Olivia Patel", address: "1456 Oakwood Ave" },
	{ name: "Ethan Kim", address: "7890 Maple Ridge Dr" },
	{ name: "Ava Morales", address: "3456 Pineview Ct" },
	{ name: "Liam Chen", address: "9012 Cedar Lane" },
	{ name: "Sophia Rodriguez", address: "6789 Spruce St"}
];

api.createDatabase();
api.appendTable("people", arrData);
api.createIndex("people", "name", true);

api.print(JSON.stringify(globals.Indexes));

var intI = 0;
api.print("LIST");
objData = api.findData("people", "name");

if (objData)
{
	api.print(intI + ", " + objData.name + ", " + objData.address);
	while (objData = api.nextData("people", "name"))
	{
		intI++;
		api.print(intI + ", " + objData.name + ", " + objData.address);
	}
}

api.appendTable("people", arrData2);
api.createIndex("people", "name", true);
//api.dropIndex("people", "name");

api.print("LIST");
intI = 0;
objData = api.findData("people", "name");
if (objData)
{
	api.print(intI + ", " + objData.name + ", " + objData.address);
	while (objData = api.nextData("people", "name"))
	{
		intI++;
		api.print(intI + ", " + objData.name + ", " + objData.address);
	}
}

api.print("END");