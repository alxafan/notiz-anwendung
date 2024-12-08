 export default function checkPw(password: string): string | null{
    let score = 0;

    //if (weakPasswords.includes(password)) {
      //  return "Das Pw steht auf einer Liste mit schwachen Passwörtern";
      //}

      const weakPasswords = [
        "12345", "abc123", "password", "computer", "123456", "tigger", "1234", "a1b2c3", "qwerty", "123", 
        "scret", "money", "test", "carmen", "mickey", "secret", "summer", "internet", "service", "canada", 
        "hello", "ranger", "shadow", "baseball", "donald", "harley", "hockey", "letmein", "maggie", "mike", 
        "mustang", "snoopy", "buster", "dragon", "jordan", "michael", "michelle", "mindy", "patrick", "123abc", 
        "andrew", "bear", "calvin", "changeme", "diamond", "fuckme", "fuckyou", "matthew", "miller", "ou812", 
        "tiger", "trustno1", "12345678", "alex", "apple", "avalon", "brandy", "chelsea", "coffee", "dave", 
        "falcon", "freedom", "gandalf", "golf", "green", "helpme", "linda", "magic", "merlin", "molson", 
        "newyork", "soccer", "thomas", "wizard", "Monday", "asdfgh", "bandit", "batman", "boris", "butthead", 
        "dorothy", "eeyore", "fishing", "football", "george", "happy", "iloveyou", "jennifer", "jonathan", 
        "love", "marina", "master", "missy", "monday", "monkey", "natasha", "ncc1701", "newpass", "pamela", 
        "pepper", "piglet", "poohbear", "pookie", "rabbit", "rachel", "rocket", "rose", "smile", "sparky", 
        "spring", "steven", "success", "sunshine", "thx1138", "victoria", "whatever", "zapata", "1", "8675309", 
        "Internet", "amanda", "andy", "angel", "august", "barney", "biteme", "boomer", "brian", "casey", "coke", 
        "cowboy", "delta", "doctor", "fisher", "foobar", "island", "john", "joshua", "karen", "marley", "orange", 
        "please", "rascal", "richard", "sarah", "scooter", "shalom", "silver", "skippy", "stanley", "taylor", 
        "welcome", "zephyr", "111111", "1928", "aaaaaa", "abc", "access", "albert", "alexander", "andrea", "anna", 
        "anthony", "asdfjkl;", "ashley", "basf", "basketball", "beavis", "black", "bob", "booboo", "bradley", 
        "brandon", "buddy", "caitlin", "camaro", "charlie", "chicken", "chris", "cindy", "cricket", "dakota", 
        "dallas", "daniel", "david", "debbie", "dolphin", "elephant", "emily", "fish", "fred", "friend", "fucker", 
        "ginger", "goodluck", "hammer", "heather", "help", "iceman", "jason", "jessica", "jesus", "joseph", 
        "jupiter", "justin", "kevin", "knight", "lacrosse", "lakers", "lizard", "madison", "mary", "mother", "muffin", 
        "murphy", "ncc1701d", "newuser", "nirvana", "none", "paris", "pat", "pentium", "phoenix", "picture", 
        "rainbow", "sandy", "saturn", "scott", "shannon", "shithead", "skeeter", "sophie", "special", "stephanie", 
        "stephen", "steve", "sweetie", "teacher", "tennis", "test123", "tommy", "topgun", "tristan", "wally", 
        "william", "wilson", "1q2w3e", "654321", "666666", "777", "a12345", "a1b2c3d4", "alpha", "amber", "angela", 
        "angie", "archie", "asdf", "blazer", "bond007", "booger", "charles", "christin", "claire", "control", 
        "danny", "david1", "dennis", "digital", "disney", "dog", "duck", "duke", "edward", "elvis", "felix", 
        "flipper", "floyd", "franklin", "frodo", "guest", "honda", "horses", "hunter", "indigo", "info", "james", 
        "jasper", "jeremy", "joe", "julian", "kelsey", "killer", "kingfish", "lauren", "marie", "maryjane", "matrix", 
        "maverick", "mayday", "mercury", "micro", "mitchell", "morgan", "mountain", "niners", "nothing", "oliver", 
        "peace", "pearljam", "phantom", "popcorn", "princess", "psycho", "pumpkin", "purple", "randy", "rebecca", 
        "reddog", "robert", "rocky", "roses", "salmon", "sam", "samson", "sharon", "sierra", "smokey", "startrek", 
        "steelers", "stimpy", "sunflower", "superman", "support", "sydney", "techno", "telecom", "test1", "walter", 
        "willie", "willow", "winner", "ziggy", "zxcvbnm", "7777", "OU812", "a", "absolut", "alaska", "alexis", 
        "alice", "animal", "apples", "babylon5", "backup", "barbara", "benjamin", "bill", "billy", "bird33", 
        "blue", "bluebird", "bobby", "bonnie", "bubba", "camera", "chocolate", "clark", "claudia", "cocacola", 
        "compton", "connect", "cookie", "cruise", "deliver", "douglas", "dreamer", "dreams", "duckie", "eagles", 
        "eddie", "einstein", "enter", "explorer", "faith", "family", "ferrari", "fire", "flamingo", "flip", "flower", 
        "foxtrot", "francis", "freddy", "friday", "froggy", "galileo", "giants", "gizmo", "global", "goofy", "gopher", 
        "hansolo", "happy1", "hendrix", "henry", "herman", "homer", "honey", "house", "houston", "iguana", "indiana", 
        "insane", "inside", "irish", "ironman", "jake", "jane", "jasmin", "jeanne", "jerry", "jim", "joey", "justice", 
        "katherine", "kermit", "kitty", "koala", "larry", "leslie", "logan", "lucky", "mark", "martin", "matt", "minnie", 
        "misty", "mitch", "mom", "mouse", "nancy", "nascar", "nelson", "netware", "pantera", "parker", "passwd", "penguin", 
        "peter", "phil", "phish", "piano", "pizza", "porsche911", "prince", "punkin", "pyramid", "rain", "raymond", 
        "red", "robin", "roger", "rosebud", "route66", "royal", "running", "sadie", "sasha", "security", "sergei", "sheena", 
        "sheila", "skiing", "snapple", "snowball", "sparrow", "spencer", "spike", "star", "stealth", "student", "sun", 
        "sunny", "sylvia", "tamara", "taurus", "tech", "teresa", "theresa", "thunderbird", "tigers", "tony", "toyota", 
        "training", "travel", "truck", "tuesday", "victory", "video", "viper1", "volvo", "wesley", "whisky", "winnie", 
        "winter", "wolves", "xyz123", "zorro", "!@#$%", "007", "123123", "1234567", "1969", "5683", "696969", "888888", 
        "Anthony", "Bond007", "Friday", "Hendrix", "Joshua", "Matthew", "October", "Taurus", "Tigger", "aaa", "aaron", 
        "abby", "abcdef", "adidas", "adrian", "alexandr", "alfred", "arthur", "athena", "austin", "awesome", "badger", 
        "bamboo", "beagle", "bears", "beatles", "beautiful", "beaver", "benny", "bigmac", "bingo", "bitch", "blonde", 
        "boogie", "boston", "brenda", "bright", "bubba1", "bubbles", "buffy", "button", "buttons", "cactus", "candy", 
        "captain", "carlos", "caroline", "carrie", "casper", "catalog", "catch22", "challenge", "chance", "charity", 
        "charlotte", "cheese", "cheryl", "chloe", "chris1", "clancy", "clipper", "coltrane", "compaq", "conrad", "cooper", 
        "cooter", "copper", "cosmos", "cougar", "cracker", "crawford", "crystal", "curtis", "cyclone", "cyrano", "dan", 
        "dance", "dawn", "dean", "deutsch", "diablo", "dilbert", "dollars", "dookie", "doom", "dumbass", "dundee", "e-mail", 
        "elizabeth", "eric", "europe", "export", "farmer", "firebird", "fletcher", "fluffy", "ford", "fountain", "fox", 
        "france", "freak1", "friends", "frog", "fuckoff", "gabriel", "gabriell", "galaxy", "gambit", "garden", "garfield", 
        "garlic", "garnet", "genesis", "genius", "godzilla", "goforit", "golfer", "goober", "grace", "grateful", "greenday", 
        "groovy", "grover", "guitar", "hacker", "harry", "hazel", "hector", "herbert", "hoops", "horizon", "hornet", 
        "howard", "icecream", "imagine", "impala", "informix", "jack", "janice", "jasmine", "jason1", "jeanette", "jeffrey", 
        "jenifer", "jenni", "jesus1", "jewels", "joker", "julie", "julie1", "junior", "justin1", "kathleen", "keith", 
        "kelly", "kelly1", "kennedy", "kevin1", "knicks", "lady", "larry1", "ledzep", "lee", "leonard", "lestat", "library", 
        "lincoln", "lionking", "london", "louise", "lucky1", "lucy", "maddog", "mailman", "majordomo", "mantra", "margaret", 
        "mariposa", "market", "marlboro", "martin1", "marty", "master1", "mazda1", "mensuck", "mercedes", "metal", "metallic", 
        "midori", "mikey", "millie", "mirage", "mmm", "molly", "monet", "money1", "monica", "monopoly", "mookie", "moose", 
        "moroni", "music", "naomi", "nathan", "ncc1701e", "nesbitt", "news", "nguyen", "nicholas", "nicole", "nimrod", 
        "october", "olive", "olivia", "one", "online", "open", "oscar", "oxford", "pacific", "painter", "peaches", "penelope", 
        "pepsi", "pete", "petunia", "philip", "phoenix1", "photo", "pickle", "player", "poiuyt", "porsche", "porter", "ppp", 
        "puppy", "python", "quality", "quest", "raquel", "raven", "remember", "republic", "research", "robbie", "robert1", 
        "roman", "rugby", "runner", "russell", "ryan", "sailing", "sailor", "samantha", "savage", "sbdc", "scarlett", "school", 
        "sean", "seven", "shadow1", "sheba", "shelby", "shit", "shoes", "simba", "simple", "skipper", "smiley", "snake", 
        "snickers", "sniper", "snoopdog", "snowman", "sonic", "spitfire", "sprite", "spunky", "starwars", "station", 
        "stella", "stingray", "storm", "stormy", "stupid", "sumuinen", "sunny1", "sunrise", "supra", "surfer", "susan", 
        "tammy", "tango", "tanya", "tara", "teddy1", "temp", "testing", "theboss", "theking", "thumper", "tina", "tintin", 
        "tomcat", "trebor", "trek", "trevor", "tweety", "unicorn", "valentine", "valerie", "vanilla", "veronica", "victor", 
        "vincent", "viper", "warrior", "warriors", "weasel", "wheels", "wilbur", "winston", "wisdom", "wombat", "xanadu", 
        "xavier", "xxxx", "yellow", "zaphod", "zeppelin", "zeus", "!@#$%^", "!@#$%^&*", "*", "0007", "1022", "10sne1", "1111", 
        "1212", "1911", "1948", "1973", "1978", "1996", "1p2o3i", "2000", "2222", "3bears", "5252", "Andrew"
      ];

    for(const weak of weakPasswords){
        if(password === weak){
            score -=1;
            return "Dieses Passwort ist unter den 500 meistgenutzten Passwörtern, bitte wähle ein anderes";
    
        } 
    }
      

    if(password.length >= 8){
        score += 1;
    }else {
        return "Ihr Passwort braucht mind. 8 Zeichen"
    }

    if(/[A-Z]/.test(password)){
        score += 1;
    }else {
        return "Ihr Passwort braucht mind. einen Großbuchstaben"
    }

    if(/[a-z]/.test(password)){
        score += 1;
    }else {
        return "Ihr Passwort braucht mind. einen Kleinbuchstaben"
    }

    if(/[0-9]/.test(password)){
        score += 1;
    }else {
        return "Ihr Passwort braucht mind. eine Zahl"
    }

    if(/[!@#$%^&*(),.?":{}|<>_\[\]\\\/'`~+=-]/.test(password)){
        score += 1;
    }else{
        return "Ihr Passwort braucht mind. ein Sonderzeichen"
    }

  if (/([a-zA-Z0-9])\1{2,}/.test(password)) {
    score-=1;
    return "Ihr Passwort darf nicht mehr als zwei gleiche hintereinander stehende Zeichen enthalten";
  }

  const sequentialPatterns = [
    "123", "234", "345", "456", "567", "678", "789", "890", 
    "abc", "abcd", "bcde", "cdef", "defg", "efgh", "fghi", 
    "ghij", "hijk", "ijkl", "jklm", "klmn", "lmno", "mnop", 
    "nopq", "opqr", "pqrs", "qrst", "rstu", "stuv", "tuvw", 
    "uvwx", "vwxy", "wxyz"
  ];

  for (const pattern of sequentialPatterns) {
    if (password.toLowerCase().includes(pattern)) {
        score-=1;
      return `Ihr Passwort darf keine aufeinanderfolgende Zeichenfolge wie '${pattern}' enthalten`;
    }
   
    
  }

    switch(score){
        case 5:
            return "Starkes Passwort!";
        case 4:
            return "Gutes Passwort.";
        case 3:
            return "Mittleres Passwort";
        case 2:
            return "Schwaches Passwort";
        default:
            return "Super krasses schwaches Passwort";
    }

}

