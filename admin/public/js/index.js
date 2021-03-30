// Quit App

let bdConnect = false;

let typeProduct = "",
    Nav = "",
    Search = "";

kronos(() => {
    // Init
    kronos().request("POST", "/GetMenu", {}, res => {
        kronos('select#menu').html("");
        res.forEach(elem => {
            kronos('select#menu').append(`<option value="${elem.Name}">${elem.Name}</option>`);
        });
        kronos('select#menu').append(`<option value="All">All</option>`);
        kronos('select#menu').append(`<option value="None">None</option>`);
    });

    kronos().request("POST", "/GetSupplement", {}, res => {
        kronos('select#supplement').html("");
        res.forEach(elem => {
            kronos('select#supplement').append(`<option value="${elem.Name}">${elem.Name}</option>`);
        });
        kronos('select#supplement').append(`<option value="All">All</option>`);
        kronos('select#supplement').append(`<option value="None">None</option>`);
    });

    kronos('select#size').append(`<option value="None">None</option>`);

    // Advanced
    filterInt = value => { return parseFloat(value) };

    function removeClass(ClassName) { OldClassName = ClassName, ClassName = "." + ClassName, document.querySelectorAll(ClassName).forEach(q => { q.classList.remove(OldClassName) }) }
    tippy('input#child', { content: "Child" });
    tippy('select#size', { content: "Size" });
    tippy('select#supplement', { content: "Supplement" });
    tippy('select#menu', { content: "Menu" });

    kronos('button#Quit').on('click', () => { kronos().request("POST", "/quit", {}, (res) => { return res }) });

    kronos('button#Bsearch').on('click', () => {
        getSearchElement(kronos('input#Isearch').value());
    });

    kronos("div#type button").on('click', q => { typeProduct = q.currentTarget.childNodes[1].innerHTML, removeClass('ClickT'), q.currentTarget.classList.add("ClickT") })
    kronos("nav#Navbar button").on('click', q => {
        Nav = q.currentTarget.childNodes[1].innerHTML;

        function clearAllInput() {
            Menu = document.querySelector("#menu").selectedIndex = 0;
            Supplement = document.querySelector("#supplement").selectedIndex = 0;
            Size = document.querySelector("#size").selectedIndex = 0;
            Name = document.querySelector("#name").value = "";
            Price = document.querySelector("#price").value = "";
            Child = document.querySelector("#child").checked = false;
        }

        if (Nav === "Menu") {
            document.querySelector("#menu").disabled = true;
            document.querySelector("#supplement").disabled = true;
            document.querySelector("#size").disabled = true;
            document.querySelector("#name").disabled = false;
            document.querySelector("#price").disabled = false;
            document.querySelector("#child").disabled = false;
            document.querySelectorAll('div#type button').forEach(q => { q.disabled = true, removeClass('ClickT') });
            clearAllInput();
        };

        if (Nav === "Product") {
            document.querySelector("#menu").disabled = false;
            document.querySelector("#supplement").disabled = false;
            document.querySelector("#size").disabled = false;
            document.querySelector("#name").disabled = false;
            document.querySelector("#price").disabled = false;
            document.querySelector("#child").disabled = true;
            document.querySelectorAll('div#type button').forEach(q => { q.disabled = false });
            clearAllInput();
        };

        if (Nav === "Supplement") {
            document.querySelector("#menu").disabled = true;
            document.querySelector("#supplement").disabled = true;
            document.querySelector("#size").disabled = true;
            document.querySelector("#name").disabled = false;
            document.querySelector("#price").disabled = false;
            document.querySelector("#child").disabled = true;
            document.querySelectorAll('div#type button').forEach(q => { q.disabled = true, removeClass('ClickT') });
            clearAllInput();
        };

        removeClass('ClickN');
        q.currentTarget.classList.add("ClickN");
    });

    kronos('button#Bnew').on('click', () => {
        if (Nav !== "") {
            if (Nav === "Menu") {
                var Name = document.querySelector("#name").value,
                    Price = document.querySelector("#price").value,
                    Child = document.querySelector("#child").checked;

                console.log(kronos().request("POST", "/NewMenu", { "Name": Name, "Price": filterInt(Price), "Child": Child, "CatType": Nav }, res => { return res }));
            };
            if (typeProduct !== "" && Nav === "Product") {
                var Menu = document.querySelector("#menu").value,
                    Supplement = document.querySelector("#supplement").value,
                    Size = document.querySelector("#size").value,
                    Name = document.querySelector("#name").value,
                    Price = document.querySelector("#price").value;

                console.log(kronos().request("POST", "/NewProduct", { "Menu": Menu, "Supplement": Supplement, "Size": Size, "Name": Name, "Price": filterInt(Price), "Type": typeProduct, "CatType": Nav }, (res) => { return res }));
            };
            if (Nav === "Supplement") {
                var Name = document.querySelector("#name").value,
                    Price = document.querySelector("#price").value;
                console.log(kronos().request("POST", "/NewSupplement", { "Name": Name, "Price": filterInt(Price), "CatType": Nav }, (res) => { return res }));
            };
        };
    });

    kronos('button#Bedit').on('click', q => {
        console.log(q, Search, Nav, typeProduct);
        if (Search !== "" && Nav !== "") {
            if (Nav === "Menu") {
                var Name = document.querySelector("#name").value,
                    Price = document.querySelector("#price").value,
                    Child = document.querySelector("#child").checked;

                kronos().request("POST", "/EditMenu", { "_id": Search, "Name": Name, "Price": filterInt(Price), "Child": Child, "CatType": Nav }, (res) => { return res });
            };

            if (typeProduct !== "" && Nav === "Product") {
                var Menu = document.querySelector("#menu").value,
                    Supplement = document.querySelector("#supplement").value,
                    Size = document.querySelector("#size").value,
                    Name = document.querySelector("#name").value,
                    Price = document.querySelector("#price").value;

                kronos().request("POST", "/EditProduct", { "_id": Search, "Menu": Menu, "Supplement": Supplement, "Size": Size, "Name": Name, "Price": filterInt(Price), "Type": typeProduct, "CatType": Nav }, (res) => { return res });
            };
            if (Nav === "Supplement") {
                var Name = document.querySelector("#name").value,
                    Price = document.querySelector("#price").value;
                kronos().request("POST", "/EditSupplement", { "_id": Search, "Name": Name, "Price": filterInt(Price), "CatType": Nav }, (res) => { return res });
            };
        }
    });

    function getSearchElement(search) {

        function CreateSearchElementResult(data) {
            kronos("div#Rsearch").html("");
            /*
            0:
                CatType: "Menu"
                Child: "true"
                Name: "tets"
                Price: 15
                _id: "60170603ffa9dc3f8ca27f6c"
            */
            var Menu = "/assets/svg/1857913-fast-food/svg/012-fast food.svg",
                Nugget = "/assets/svg/1857913-fast-food/svg/029-nuggets.svg",
                Salade = "/assets/svg/1857913-fast-food/svg/041-salad.svg",
                HotDrink = "/assets/svg/1857913-fast-food/svg/038-coffee cup.svg",
                ColdDrink = "/assets/svg/1857913-fast-food/svg/034-Soft drink.svg",
                Burger = "/assets/svg/1857913-fast-food/svg/044-cheese burger.svg",
                Wrap = "/assets/svg/1857913-fast-food/svg/031-kebab.svg",
                Fries = "/assets/svg/1857913-fast-food/svg/010-french fries.svg",
                Supplement = "/assets/svg/1857913-fast-food/svg/004-bacon.svg",
                res = "";

            data.forEach(elem => {
                if (elem.CatType == "Menu") {
                    res += `<button id="${elem._id}"><img src="${Menu}"><span>${elem.Name}</span></button>`;
                };

                if (elem.CatType == "Product") {
                    if (elem.Type == "Burger") {
                        res += `<button id="${elem._id}"><img src="${Burger}"><span>${elem.Name}</span></button>`;
                    };

                    if (elem.Type == "Nugget") {
                        res += `<button id="${elem._id}"><img src="${Nugget}"><span>${elem.Name}</span></button>`;
                    };

                    if (elem.Type == "Salade") {
                        res += `<button id="${elem._id}"><img src="${Salade}"><span>${elem.Name}</span></button>`;
                    };

                    if (elem.Type == "Drink") {
                        res += `<button class="double" id="${elem._id}"><div><img src="${HotDrink}"><img src="${ColdDrink}"></div><span>${elem.Name}</span></button>`;
                    };

                    if (elem.Type == "Wrap") {
                        res += `<button id="${elem._id}"><img src="${Wrap}"><span>${elem.Name}</span></button>`;
                    };

                    if (elem.Type == "Fries") {
                        res += `<button id="${elem._id}"><img src="${Fries}"><span>${elem.Name}</span></button>`;
                    };
                };

                if (elem.CatType == "Supplement") {
                    res += `<button id="${elem._id}"><img src="${Supplement}"><span>${elem.Name}</span></button>`;
                }
            });

            kronos("div#Rsearch").html(res);

            kronos('div#Rsearch button').on('click', q => {
                // #\36 0170376426fe207a4eca25f
                removeClass("ClickS");
                q.currentTarget.classList.add("ClickS");
                Search = q.currentTarget.id;
                if (Nav === "Menu") {
                    kronos().request("POST", "/GetMenu", { "search": q.currentTarget.id, "column": '_id' }, data => {
                        console.log(data);
                        data = data[0]
                        var childVal = (data.Child == 'true') || (data.Child != 'true');
                        Name = document.querySelector("#name").value = data.Name;
                        Price = document.querySelector("#price").value = data.Price;
                        Child = document.querySelector("#child").checked = childVal;
                    });
                } else if (Nav === "Product") {
                    kronos().request("POST", "/GetProduct", { "search": q.currentTarget.id, "column": '_id' }, data => {
                        console.log(data);
                        data = data[0];
                        document.querySelector("#menu").value = data.Menu;
                        document.querySelector("#supplement").value = data.Supplement;
                        document.querySelector("#size").value = data.Size;
                        document.querySelector("#name").value = data.Name;
                        document.querySelector("#price").value = data.Price;
                        typeProduct = data.Type;
                        removeClass('ClickT');
                        kronos(`button#${data.Type}`).class('add', 'ClickT');
                    });
                } else if (Nav === 'Supplement') {
                    kronos().request("POST", "/GetSupplement", { "search": q.currentTarget.id, "column": '_id' }, data => {
                        console.log(data);
                        data = data[0];

                        document.querySelector("#name").value = data.Name;
                        document.querySelector("#price").value = data.Price;
                    });
                };
            });

            return res;
        };

        if (Nav === "Menu") {
            kronos().request("POST", "/GetMenu", { "search": search },
                (data) => {
                    console.log(data, CreateSearchElementResult(data));
                }
            );
        };
        if (Nav === "Product") {
            kronos().request("POST", "/GetProduct", { "search": search },
                (data) => {
                    console.log(data, CreateSearchElementResult(data));
                }
            );
        };
        if (Nav === "Supplement") {
            kronos().request("POST", "/GetSupplement", { "search": search },
                (data) => {
                    console.log(data, CreateSearchElementResult(data));
                }
            );
        };
    };

    // setInterval(() => { bdConnect || kronos().request("POST", "/state-bd", {}, data => { "connect-bd" === data.state ? (kronos("div#db img").attr("src", "/assets/svg/391100-electronic-and-web-element-collection/svg/013-database-2.svg"), kronos("div#db span").html("Connected"), bdConnect = !0) : console.error(data.error) }) }, 2e3);

    setInterval(() => {
        if (!bdConnect) {
            kronos().request("POST", "/state-bd", {}, data => {
                if ("connect-bd" === data.state) {
                    kronos("div#db img").attr("add", "src", "/assets/svg/391100-electronic-and-web-element-collection/svg/013-database-2.svg");
                    kronos("div#db span").html("Connected");
                    bdConnect = true;
                } else {
                    console.error(data);
                }
            })
        };
    }, 2e3)
});