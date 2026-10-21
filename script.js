/* =========================================
   KWASU STUDENT COMPANION
   HERO FUNCTIONALITY
========================================= */

/* =========================================
   1. LIVE NIGERIAN TIME
========================================= */

function updateClock() {
  const clock = document.getElementById("live-clock");
  const date = document.getElementById("live-date");

  if (!clock || !date) {
    return;
  }

  const now = new Date();

  const timeFormatter = new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const dateFormatter = new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  clock.textContent = timeFormatter.format(now);
  date.textContent = dateFormatter.format(now);
}

updateClock();

setInterval(updateClock, 1000);

/* =========================================
   2. LIVE MALETE WEATHER
========================================= */

const MALETE_LATITUDE = 8.7167;
const MALETE_LONGITUDE = 4.4333;

async function loadWeather() {
  const temperature = document.getElementById("weather-temperature");

  const condition = document.getElementById("weather-condition");

  const wind = document.getElementById("weather-wind");

  const humidity = document.getElementById("weather-humidity");

  const icon = document.getElementById("weather-icon");

  if (!temperature || !condition || !wind || !humidity || !icon) {
    return;
  }

  try {
    const apiURL =
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=" +
      MALETE_LATITUDE +
      "&longitude=" +
      MALETE_LONGITUDE +
      "&current=" +
      "temperature_2m," +
      "relative_humidity_2m," +
      "weather_code," +
      "wind_speed_10m" +
      "&temperature_unit=celsius" +
      "&wind_speed_unit=kmh" +
      "&timezone=Africa%2FLagos";

    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error("Weather request failed.");
    }

    const data = await response.json();

    const currentWeather = data.current;

    temperature.textContent = Math.round(currentWeather.temperature_2m) + "°C";

    humidity.textContent = Math.round(currentWeather.relative_humidity_2m);

    wind.textContent = Math.round(currentWeather.wind_speed_10m);

    const weather = getWeatherInformation(currentWeather.weather_code);

    condition.textContent = weather.description;

    icon.textContent = weather.icon;
  } catch (error) {
    console.error("Weather error:", error);

    temperature.textContent = "--°C";
    condition.textContent = "Weather unavailable";
    wind.textContent = "--";
    humidity.textContent = "--";
    icon.textContent = "⚠️";
  }
}

/* =========================================
   3. WEATHER CONDITIONS
========================================= */

function getWeatherInformation(code) {
  const weatherCodes = {
    0: {
      description: "Clear sky",
      icon: "☀️",
    },

    1: {
      description: "Mainly clear",
      icon: "🌤️",
    },

    2: {
      description: "Partly cloudy",
      icon: "⛅",
    },

    3: {
      description: "Overcast",
      icon: "☁️",
    },

    45: {
      description: "Fog",
      icon: "🌫️",
    },

    48: {
      description: "Fog",
      icon: "🌫️",
    },

    51: {
      description: "Light drizzle",
      icon: "🌦️",
    },

    53: {
      description: "Moderate drizzle",
      icon: "🌦️",
    },

    55: {
      description: "Heavy drizzle",
      icon: "🌧️",
    },

    61: {
      description: "Slight rain",
      icon: "🌦️",
    },

    63: {
      description: "Moderate rain",
      icon: "🌧️",
    },

    65: {
      description: "Heavy rain",
      icon: "🌧️",
    },

    71: {
      description: "Slight snow",
      icon: "🌨️",
    },

    73: {
      description: "Moderate snow",
      icon: "🌨️",
    },

    75: {
      description: "Heavy snow",
      icon: "❄️",
    },

    77: {
      description: "Snow grains",
      icon: "❄️",
    },

    80: {
      description: "Slight rain showers",
      icon: "🌦️",
    },

    81: {
      description: "Moderate rain showers",
      icon: "🌧️",
    },

    82: {
      description: "Heavy rain showers",
      icon: "⛈️",
    },

    85: {
      description: "Slight snow showers",
      icon: "🌨️",
    },

    86: {
      description: "Heavy snow showers",
      icon: "❄️",
    },

    95: {
      description: "Thunderstorm",
      icon: "⛈️",
    },

    96: {
      description: "Thunderstorm with hail",
      icon: "⛈️",
    },

    99: {
      description: "Thunderstorm with heavy hail",
      icon: "⛈️",
    },
  };

  return (
    weatherCodes[code] || {
      description: "Current conditions",
      icon: "🌤️",
    }
  );
}

loadWeather();

setInterval(loadWeather, 10 * 60 * 1000);

/* =========================================
   4. INTERACTIVE KWASU MAP
========================================= */

function initializeMap() {
  const mapContainer = document.getElementById("kwasu-map");

  if (!mapContainer) {
    return;
  }

  /*
       Prevent the map from being initialized
       more than once.
    */

  if (mapContainer.dataset.mapLoaded === "true") {
    return;
  }

  /*
       Malete / KWASU area
    */

  const kwasuLatitude = 8.7167;
  const kwasuLongitude = 4.4333;

  /*
       Create the map
    */

  const map = L.map("kwasu-map", {
    zoomControl: true,
    scrollWheelZoom: true,
  }).setView([kwasuLatitude, kwasuLongitude], 14);

  /*
       Add OpenStreetMap tiles
    */

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,

    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
  }).addTo(map);

  /*
       Create KWASU marker
    */

  const kwasuMarker = L.marker([kwasuLatitude, kwasuLongitude]).addTo(map);

  /*
       Popup shown when marker is clicked
    */

  kwasuMarker.bindPopup(`
        <div style="min-width: 180px;">
            <strong style="font-size: 14px;">
                Kwara State University
            </strong>

            <br>

            <span style="font-size: 12px;">
                📍 Malete, Kwara State
            </span>

            <br><br>

            <span style="font-size: 11px;">
                KWASU Main Campus
            </span>
        </div>
    `);

  /*
       Open the popup automatically
    */

  kwasuMarker.openPopup();

  /*
       Mark the map as loaded
    */

  mapContainer.dataset.mapLoaded = "true";

  /*
       Fix map sizing after it becomes visible
    */

  setTimeout(() => {
    map.invalidateSize();
  }, 300);
}

/* =========================================
   5. START MAP
========================================= */

if (typeof L !== "undefined") {
  initializeMap();
} else {
  console.error(
    "Leaflet did not load. Check the Leaflet script in index.html.",
  );
}

/* =========================================
   ACADEMIC HUB
========================================= */

/* =========================================
   1. COURSE DATA
========================================= */

const courseData = {
  "computer-science": [
    {
      code: "CSC 301",
      name: "Data Structures",
      units: 3,
    },
    {
      code: "CSC 303",
      name: "Computer Architecture",
      units: 3,
    },
    {
      code: "CSC 305",
      name: "Database Systems",
      units: 3,
    },
    {
      code: "CSC 307",
      name: "Operating Systems",
      units: 3,
    },
    {
      code: "CSC 309",
      name: "Computer Networks",
      units: 3,
    },
  ],

  accounting: [
    {
      code: "ACC 301",
      name: "Financial Accounting",
      units: 3,
    },
    {
      code: "ACC 303",
      name: "Management Accounting",
      units: 3,
    },
    {
      code: "ACC 305",
      name: "Taxation",
      units: 3,
    },
    {
      code: "ACC 307",
      name: "Auditing",
      units: 3,
    },
  ],

  economics: [
    {
      code: "ECO 301",
      name: "Microeconomic Theory",
      units: 3,
    },
    {
      code: "ECO 303",
      name: "Macroeconomic Theory",
      units: 3,
    },
    {
      code: "ECO 305",
      name: "Econometrics",
      units: 3,
    },
    {
      code: "ECO 307",
      name: "Development Economics",
      units: 3,
    },
  ],

  "business-administration": [
    {
      code: "BUS 301",
      name: "Business Management",
      units: 3,
    },
    {
      code: "BUS 303",
      name: "Organizational Behaviour",
      units: 3,
    },
    {
      code: "BUS 305",
      name: "Marketing Management",
      units: 3,
    },
    {
      code: "BUS 307",
      name: "Business Finance",
      units: 3,
    },
  ],

  "political-science": [
    {
      code: "POL 301",
      name: "Political Theory",
      units: 3,
    },
    {
      code: "POL 303",
      name: "Comparative Politics",
      units: 3,
    },
    {
      code: "POL 305",
      name: "Public Policy",
      units: 3,
    },
    {
      code: "POL 307",
      name: "International Relations",
      units: 3,
    },
  ],

  "mass-communication": [
    {
      code: "MAC 301",
      name: "Broadcast Production",
      units: 3,
    },
    {
      code: "MAC 303",
      name: "Media Writing",
      units: 3,
    },
    {
      code: "MAC 305",
      name: "Communication Theory",
      units: 3,
    },
    {
      code: "MAC 307",
      name: "Media Management",
      units: 3,
    },
  ],

  microbiology: [
    {
      code: "MCB 301",
      name: "General Microbiology",
      units: 3,
    },
    {
      code: "MCB 303",
      name: "Microbial Physiology",
      units: 3,
    },
    {
      code: "MCB 305",
      name: "Medical Microbiology",
      units: 3,
    },
    {
      code: "MCB 307",
      name: "Industrial Microbiology",
      units: 3,
    },
  ],

  biochemistry: [
    {
      code: "BCH 301",
      name: "Protein Biochemistry",
      units: 3,
    },
    {
      code: "BCH 303",
      name: "Enzymology",
      units: 3,
    },
    {
      code: "BCH 305",
      name: "Metabolism",
      units: 3,
    },
    {
      code: "BCH 307",
      name: "Molecular Biology",
      units: 3,
    },
  ],

  mathematics: [
    {
      code: "MAT 301",
      name: "Advanced Calculus",
      units: 3,
    },
    {
      code: "MAT 303",
      name: "Differential Equations",
      units: 3,
    },
    {
      code: "MAT 305",
      name: "Linear Algebra",
      units: 3,
    },
    {
      code: "MAT 307",
      name: "Numerical Analysis",
      units: 3,
    },
  ],

  chemistry: [
    {
      code: "CHM 301",
      name: "Physical Chemistry",
      units: 3,
    },
    {
      code: "CHM 303",
      name: "Organic Chemistry",
      units: 3,
    },
    {
      code: "CHM 305",
      name: "Inorganic Chemistry",
      units: 3,
    },
    {
      code: "CHM 307",
      name: "Analytical Chemistry",
      units: 3,
    },
  ],

  "mechanical-engineering": [
    {
      code: "MEE 301",
      name: "Thermodynamics",
      units: 3,
    },
    {
      code: "MEE 303",
      name: "Fluid Mechanics",
      units: 3,
    },
    {
      code: "MEE 305",
      name: "Engineering Materials",
      units: 3,
    },
    {
      code: "MEE 307",
      name: "Machine Design",
      units: 3,
    },
  ],

  "civil-engineering": [
    {
      code: "CVE 301",
      name: "Structural Analysis",
      units: 3,
    },
    {
      code: "CVE 303",
      name: "Soil Mechanics",
      units: 3,
    },
    {
      code: "CVE 305",
      name: "Fluid Mechanics",
      units: 3,
    },
    {
      code: "CVE 307",
      name: "Construction Technology",
      units: 3,
    },
  ],

  english: [
    {
      code: "ENG 301",
      name: "Advanced English Grammar",
      units: 3,
    },
    {
      code: "ENG 303",
      name: "Literary Criticism",
      units: 3,
    },
    {
      code: "ENG 305",
      name: "African Literature",
      units: 3,
    },
    {
      code: "ENG 307",
      name: "Language and Society",
      units: 3,
    },
  ],

  history: [
    {
      code: "HIS 301",
      name: "African History",
      units: 3,
    },
    {
      code: "HIS 303",
      name: "Diplomatic History",
      units: 3,
    },
    {
      code: "HIS 305",
      name: "Modern World History",
      units: 3,
    },
  ],
};

/* =========================================
   2. COURSE EXPLORER
========================================= */

const programmeSelect = document.getElementById("programme-select");

const levelSelect = document.getElementById("level-select");

const semesterSelect = document.getElementById("semester-select");

const courseSearch = document.getElementById("course-search");

const courseResults = document.getElementById("course-results");

const selectedCourseCount = document.getElementById("selected-course-count");

const selectedUnitCount = document.getElementById("selected-unit-count");

const selectedCourses = [];

function renderCourses() {
  if (!programmeSelect || !courseResults) {
    return;
  }

  const programme = programmeSelect.value;

  if (!programme) {
    courseResults.innerHTML = `
            <div class="course-empty">

                <div class="course-empty-icon">
                    📚
                </div>

                <h4>
                    Select your programme to get started
                </h4>

                <p>
                    Choose your programme, level and semester above.
                    Your available courses will appear here.
                </p>

            </div>
        `;

    updateSelectedCourseSummary();

    return;
  }

  let courses = courseData[programme] || [];

  const search = courseSearch ? courseSearch.value.trim().toLowerCase() : "";

  if (search) {
    courses = courses.filter(
      (course) =>
        course.code.toLowerCase().includes(search) ||
        course.name.toLowerCase().includes(search),
    );
  }

  if (courses.length === 0) {
    courseResults.innerHTML = `
            <div class="course-empty">

                <div class="course-empty-icon">
                    🔎
                </div>

                <h4>
                    No courses found
                </h4>

                <p>
                    Try another search term or select another programme.
                </p>

            </div>
        `;

    return;
  }

  courseResults.innerHTML = courses
    .map((course) => {
      const isSelected = selectedCourses.some(
        (selected) => selected.code === course.code,
      );

      return `
                <label class="course-card">

                    <input
                        type="checkbox"
                        class="course-select"
                        data-code="${course.code}"
                        data-name="${course.name}"
                        data-units="${course.units}"
                        ${isSelected ? "checked" : ""}
                    >

                    <div class="course-info">

                        <span class="course-code">
                            ${course.code}
                        </span>

                        <span class="course-name">
                            ${course.name}
                        </span>

                    </div>

                    <span class="course-unit">
                        ${course.units} Units
                    </span>

                </label>
            `;
    })
    .join("");

  const checkboxes = courseResults.querySelectorAll(".course-select");

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCourseSelection);
  });

  updateSelectedCourseSummary();
}

function handleCourseSelection(event) {
  const checkbox = event.target;

  const course = {
    code: checkbox.dataset.code,

    name: checkbox.dataset.name,

    units: Number(checkbox.dataset.units),
  };

  if (checkbox.checked) {
    const exists = selectedCourses.some(
      (selected) => selected.code === course.code,
    );

    if (!exists) {
      selectedCourses.push(course);
    }
  } else {
    const index = selectedCourses.findIndex(
      (selected) => selected.code === course.code,
    );

    if (index !== -1) {
      selectedCourses.splice(index, 1);
    }
  }

  updateSelectedCourseSummary();
}

function updateSelectedCourseSummary() {
  if (!selectedCourseCount || !selectedUnitCount) {
    return;
  }

  const totalUnits = selectedCourses.reduce(
    (total, course) => total + course.units,
    0,
  );

  selectedCourseCount.textContent = `${selectedCourses.length} course${
    selectedCourses.length === 1 ? "" : "s"
  }`;

  selectedUnitCount.textContent = `${totalUnits} unit${
    totalUnits === 1 ? "" : "s"
  }`;
}

if (programmeSelect) {
  programmeSelect.addEventListener("change", renderCourses);
}

if (levelSelect) {
  levelSelect.addEventListener("change", renderCourses);
}

if (semesterSelect) {
  semesterSelect.addEventListener("change", renderCourses);
}

if (courseSearch) {
  courseSearch.addEventListener("input", renderCourses);
}

/* =========================================
   3. NORMAL DIGITAL CALCULATOR
========================================= */

const calculatorDisplay = document.getElementById("calculator-display");

let calculatorValue = "0";
let previousValue = null;
let calculatorOperator = null;
let waitingForNewValue = false;

function updateCalculatorDisplay() {
  if (calculatorDisplay) {
    calculatorDisplay.textContent = calculatorValue;
  }
}

function enterNumber(number) {
  if (calculatorValue === "0" || waitingForNewValue) {
    calculatorValue = number;
    waitingForNewValue = false;
  } else {
    calculatorValue += number;
  }

  updateCalculatorDisplay();
}

function enterDecimal() {
  if (waitingForNewValue) {
    calculatorValue = "0.";
    waitingForNewValue = false;

    updateCalculatorDisplay();

    return;
  }

  if (!calculatorValue.includes(".")) {
    calculatorValue += ".";

    updateCalculatorDisplay();
  }
}

function chooseOperator(operator) {
  const current = Number(calculatorValue);

  if (calculatorOperator && !waitingForNewValue) {
    calculateResult();
  }

  previousValue = Number(calculatorValue);

  calculatorOperator = operator;

  waitingForNewValue = true;
}

function calculateResult() {
  if (calculatorOperator === null || previousValue === null) {
    return;
  }

  const current = Number(calculatorValue);

  let result;

  switch (calculatorOperator) {
    case "+":
      result = previousValue + current;
      break;

    case "-":
      result = previousValue - current;
      break;

    case "*":
      result = previousValue * current;
      break;

    case "/":
      if (current === 0) {
        calculatorValue = "Error";

        previousValue = null;
        calculatorOperator = null;
        waitingForNewValue = true;

        updateCalculatorDisplay();

        return;
      }

      result = previousValue / current;

      break;

    default:
      return;
  }

  calculatorValue = String(Number(result.toFixed(8)));

  previousValue = null;
  calculatorOperator = null;
  waitingForNewValue = true;

  updateCalculatorDisplay();
}

function clearCalculator() {
  calculatorValue = "0";
  previousValue = null;
  calculatorOperator = null;
  waitingForNewValue = false;

  updateCalculatorDisplay();
}

function changeSign() {
  if (calculatorValue !== "0") {
    calculatorValue = String(Number(calculatorValue) * -1);

    updateCalculatorDisplay();
  }
}

function calculatePercent() {
  calculatorValue = String(Number(calculatorValue) / 100);

  updateCalculatorDisplay();
}

document.querySelectorAll("[data-calculator]").forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.calculator;

    if (type === "number") {
      enterNumber(button.dataset.value);
    } else if (type === "decimal") {
      enterDecimal();
    } else if (type === "operator") {
      chooseOperator(button.dataset.value);
    } else if (type === "equals") {
      calculateResult();
    } else if (type === "clear") {
      clearCalculator();
    } else if (type === "sign") {
      changeSign();
    } else if (type === "percent") {
      calculatePercent();
    }
  });
});

/* =========================================
   4. CGPA CALCULATOR
========================================= */

const cgpaRows = document.getElementById("cgpa-rows");

const addCgpaRowButton = document.getElementById("add-cgpa-row");

const calculateCgpaButton = document.getElementById("calculate-cgpa");

function createCgpaRow(course = "", units = "", grade = "") {
  const row = document.createElement("div");

  row.className = "cgpa-row";

  row.innerHTML = `

        <input
            type="text"
            placeholder="Course code"
            class="cgpa-course"
            value="${course}"
        >

        <input
            type="number"
            min="1"
            max="10"
            placeholder="3"
            class="cgpa-unit"
            value="${units}"
        >

        <select class="cgpa-grade">

            <option value="">
                Grade
            </option>

            <option value="5" ${grade === "5" ? "selected" : ""}>
                A
            </option>

            <option value="4" ${grade === "4" ? "selected" : ""}>
                B
            </option>

            <option value="3" ${grade === "3" ? "selected" : ""}>
                C
            </option>

            <option value="2" ${grade === "2" ? "selected" : ""}>
                D
            </option>

            <option value="1" ${grade === "1" ? "selected" : ""}>
                E
            </option>

            <option value="0" ${grade === "0" ? "selected" : ""}>
                F
            </option>

        </select>

        <button
            type="button"
            class="remove-cgpa-row"
        >
            ×
        </button>

    `;

  row.querySelector(".remove-cgpa-row").addEventListener("click", () => {
    row.remove();
  });

  cgpaRows.appendChild(row);
}

if (addCgpaRowButton) {
  addCgpaRowButton.addEventListener("click", () => {
    createCgpaRow();
  });
}

/* =========================================
   5. CALCULATE GPA
========================================= */

function calculateGPA() {
  const rows = document.querySelectorAll(".cgpa-row");

  let totalUnits = 0;
  let qualityPoints = 0;

  rows.forEach((row) => {
    const unitInput = row.querySelector(".cgpa-unit");

    const gradeInput = row.querySelector(".cgpa-grade");

    const units = Number(unitInput.value);

    const gradePoint = Number(gradeInput.value);

    if (units > 0 && gradeInput.value !== "") {
      totalUnits += units;

      qualityPoints += units * gradePoint;
    }
  });

  const gpa = totalUnits > 0 ? qualityPoints / totalUnits : 0;

  const totalUnitsDisplay = document.getElementById("cgpa-total-units");

  const qualityPointsDisplay = document.getElementById("cgpa-quality-points");

  const gpaDisplay = document.getElementById("cgpa-result");

  if (totalUnitsDisplay) {
    totalUnitsDisplay.textContent = totalUnits;
  }

  if (qualityPointsDisplay) {
    qualityPointsDisplay.textContent = qualityPoints.toFixed(2);
  }

  if (gpaDisplay) {
    gpaDisplay.textContent = gpa.toFixed(2);
  }
}

if (calculateCgpaButton) {
  calculateCgpaButton.addEventListener("click", calculateGPA);
}

/* =========================================
   6. SEND SELECTED COURSES TO CGPA
========================================= */

const useCoursesButton = document.getElementById("use-courses-btn");

if (useCoursesButton) {
  useCoursesButton.addEventListener("click", () => {
    if (selectedCourses.length === 0) {
      alert("Please select at least one course first.");

      return;
    }

    cgpaRows.innerHTML = "";

    selectedCourses.forEach((course) => {
      createCgpaRow(course.code, course.units);
    });

    document.querySelector(".cgpa-card").scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });
}

/* =================================
   CAMPUS GUIDE + CAMPUS SEARCH
================================= */

const campusLocations = [
  {
    id: "main-campus",
    name: "KWASU Main Campus",
    category: "academic",
    categoryLabel: "University",
    icon: "🎓",
    description:
      "The main campus of Kwara State University in Malete, Kwara State.",
    area: "Malete, Kwara State",
    lat: 8.7167,
    lng: 4.4333,
  },

  {
    id: "library",
    name: "Muhammadu Buhari Main Library",
    category: "academic",
    categoryLabel: "Academic",
    icon: "📚",
    description:
      "The main university library providing learning, research and study resources.",
    area: "KWASU Main Campus",
    lat: 8.718,
    lng: 4.4342,
  },

  {
    id: "ict",
    name: "ICT Experience Centre",
    category: "academic",
    categoryLabel: "Technology",
    icon: "💻",
    description:
      "A technology-focused centre supporting digital skills, learning, research and innovation.",
    area: "KWASU Main Campus",
    lat: 8.7173,
    lng: 4.4327,
  },

  {
    id: "faculty-ict",
    name: "Faculty of Information & Communication Technology",
    category: "academic",
    categoryLabel: "Faculty",
    icon: "🖥️",
    description:
      "Home to departments including Computer Science, Library and Information Science, and Mass Communication.",
    area: "KWASU Main Campus",
    lat: 8.7164,
    lng: 4.4348,
  },

  {
    id: "medical",
    name: "KWASU Medical Centre",
    category: "services",
    categoryLabel: "Health Service",
    icon: "🏥",
    description:
      "University health service facility available to support students and members of the university community.",
    area: "KWASU Main Campus",
    lat: 8.7158,
    lng: 4.4318,
  },

  {
    id: "senate",
    name: "Muhammadu Mustapha Akanbi SAN Senate Building",
    category: "services",
    categoryLabel: "Administration",
    icon: "🏛️",
    description: "A major administrative building on the KWASU Malete campus.",
    area: "KWASU Main Campus",
    lat: 8.7177,
    lng: 4.4314,
  },

  {
    id: "performing-arts",
    name: "Performing Arts Theatre",
    category: "recreation",
    categoryLabel: "Arts & Culture",
    icon: "🎭",
    description:
      "A major campus venue for performances, cultural activities and events.",
    area: "KWASU Main Campus",
    lat: 8.7148,
    lng: 4.434,
  },

  {
    id: "convocation",
    name: "Mini Convocation Arena",
    category: "recreation",
    categoryLabel: "Events",
    icon: "🎓",
    description:
      "Campus venue used for university ceremonies and important events.",
    area: "KWASU Main Campus",
    lat: 8.716,
    lng: 4.4355,
  },

  {
    id: "stadium",
    name: "University Stadium Complex",
    category: "recreation",
    categoryLabel: "Sports",
    icon: "⚽",
    description:
      "University sports and recreation area used for sporting activities and events.",
    area: "KWASU Main Campus",
    lat: 8.7137,
    lng: 4.4328,
  },

  {
    id: "student-life",
    name: "Student Life & Recreation Area",
    category: "student",
    categoryLabel: "Student Life",
    icon: "👥",
    description:
      "Student-focused spaces supporting recreation, social activities and campus life.",
    area: "KWASU Main Campus",
    lat: 8.7144,
    lng: 4.4352,
  },
];

/* ---------------------------------
   CAMPUS MAP
--------------------------------- */

let campusMap = null;
let campusMarkers = {};
let activeCampusLocation = "main-campus";

function initializeCampusMap() {
  const mapElement = document.getElementById("campus-map");

  if (!mapElement) {
    return;
  }

  if (typeof L === "undefined") {
    console.error("Leaflet is not loaded.");
    return;
  }

  campusMap = L.map("campus-map").setView([8.7167, 4.4333], 16);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(campusMap);

  campusLocations.forEach((location) => {
    const marker = L.marker([location.lat, location.lng]).addTo(campusMap);

    marker.bindPopup(`
            <strong>${location.icon} ${location.name}</strong>
            <br>
            <span>${location.categoryLabel}</span>
        `);

    marker.on("click", () => {
      selectCampusLocation(location.id);
    });

    campusMarkers[location.id] = marker;
  });

  setTimeout(() => {
    campusMap.invalidateSize();
  }, 300);
}

/* ---------------------------------
   RENDER LOCATIONS
--------------------------------- */

function renderCampusLocations(searchTerm = "", category = "all") {
  const list = document.getElementById("campus-location-list");

  const count = document.getElementById("campus-result-count");

  const noResults = document.getElementById("campus-no-results");

  if (!list) {
    return;
  }

  const search = searchTerm.trim().toLowerCase();

  const filteredLocations = campusLocations.filter((location) => {
    const matchesCategory =
      category === "all" || location.category === category;

    const searchableText = `
                ${location.name}
                ${location.categoryLabel}
                ${location.description}
                ${location.area}
            `.toLowerCase();

    const matchesSearch = search === "" || searchableText.includes(search);

    return matchesCategory && matchesSearch;
  });

  list.innerHTML = "";

  filteredLocations.forEach((location) => {
    const card = document.createElement("button");

    card.type = "button";

    card.className =
      "campus-location-card" +
      (location.id === activeCampusLocation ? " active" : "");

    card.innerHTML = `
            <span class="location-icon">
                ${location.icon}
            </span>

            <span>
                <h4>${location.name}</h4>

                <p>
                    ${location.description}
                </p>

                <span class="location-category">
                    ${location.categoryLabel}
                </span>
            </span>
        `;

    card.addEventListener("click", () => {
      selectCampusLocation(location.id);
    });

    list.appendChild(card);
  });

  count.textContent = `${filteredLocations.length} ${
    filteredLocations.length === 1 ? "place" : "places"
  }`;

  noResults.hidden = filteredLocations.length !== 0;
}

/* ---------------------------------
   SELECT LOCATION
--------------------------------- */

function selectCampusLocation(locationId) {
  const location = campusLocations.find((item) => item.id === locationId);

  if (!location) {
    return;
  }

  activeCampusLocation = locationId;

  const nameElement = document.getElementById("selected-location-name");

  const iconElement = document.getElementById("selected-location-icon");

  const categoryElement = document.getElementById("selected-location-category");

  const titleElement = document.getElementById("selected-location-title");

  const descriptionElement = document.getElementById(
    "selected-location-description",
  );

  const areaElement = document.getElementById("selected-location-area");

  const directionsElement = document.getElementById("campus-directions");

  if (nameElement) {
    nameElement.textContent = location.name;
  }

  if (iconElement) {
    iconElement.textContent = location.icon;
  }

  if (categoryElement) {
    categoryElement.textContent = location.categoryLabel.toUpperCase();
  }

  if (titleElement) {
    titleElement.textContent = location.name;
  }

  if (descriptionElement) {
    descriptionElement.textContent = location.description;
  }

  if (areaElement) {
    areaElement.textContent = `📍 ${location.area}`;
  }

  if (directionsElement) {
    const destination = `${location.lat},${location.lng}`;

    directionsElement.href = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  }

  if (campusMap) {
    campusMap.setView([location.lat, location.lng], 17, {
      animate: true,
    });

    const marker = campusMarkers[location.id];

    if (marker) {
      marker.openPopup();
    }
  }

  renderCampusLocations(
    document.getElementById("campus-search")?.value || "",
    document.querySelector(".campus-filter.active")?.dataset.category || "all",
  );
}

/* ---------------------------------
   SEARCH
--------------------------------- */

const campusSearch = document.getElementById("campus-search");

if (campusSearch) {
  campusSearch.addEventListener("input", () => {
    const activeFilter = document.querySelector(".campus-filter.active");

    renderCampusLocations(
      campusSearch.value,
      activeFilter ? activeFilter.dataset.category : "all",
    );
  });
}

/* ---------------------------------
   CLEAR SEARCH
--------------------------------- */

const clearCampusSearch = document.getElementById("clear-campus-search");

if (clearCampusSearch) {
  clearCampusSearch.addEventListener("click", () => {
    if (campusSearch) {
      campusSearch.value = "";
      campusSearch.focus();
    }

    const activeFilter = document.querySelector(".campus-filter.active");

    renderCampusLocations(
      "",
      activeFilter ? activeFilter.dataset.category : "all",
    );
  });
}

/* ---------------------------------
   CATEGORY FILTERS
--------------------------------- */

const campusFilters = document.querySelectorAll(".campus-filter");

campusFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    campusFilters.forEach((button) => {
      button.classList.remove("active");
    });

    filter.classList.add("active");

    renderCampusLocations(
      campusSearch ? campusSearch.value : "",
      filter.dataset.category,
    );
  });
});

/* ---------------------------------
   START CAMPUS GUIDE
--------------------------------- */

initializeCampusMap();

renderCampusLocations();

selectCampusLocation("main-campus");

/* =================================
   FOCUS STUDY TIMER
================================= */

let timerInterval = null;

let timerDuration = 25 * 60;
let timerRemaining = 25 * 60;

let timerRunning = false;
let timerPaused = false;

let focusData = JSON.parse(localStorage.getItem("kwasuFocusData")) || {
  date: "",
  totalSeconds: 0,
  completedSessions: 0,
};

/* ---------------------------------
   TIMER ELEMENTS
--------------------------------- */

const timerDisplay = document.getElementById("timer-display");

const timerStartButton = document.getElementById("timer-start");

const timerResetButton = document.getElementById("timer-reset");

const timerStatus = document.getElementById("timer-status");

const timerMessage = document.getElementById("timer-message");

const timerProgress = document.getElementById("timer-progress-bar");

const timerMode = document.getElementById("timer-mode");

const todayFocusTime = document.getElementById("today-focus-time");

const completedSessions = document.getElementById("completed-sessions");

const currentSessionLength = document.getElementById("current-session-length");

const timerPresets = document.querySelectorAll(".timer-preset");

const customMinutes = document.getElementById("custom-minutes");

const setCustomTimer = document.getElementById("set-custom-timer");

/* ---------------------------------
   DATE CHECK
--------------------------------- */

function getTodayDate() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function resetDailyFocusIfNeeded() {
  const today = getTodayDate();

  if (focusData.date !== today) {
    focusData = {
      date: today,
      totalSeconds: 0,
      completedSessions: 0,
    };

    saveFocusData();
  }
}

/* ---------------------------------
   SAVE DATA
--------------------------------- */

function saveFocusData() {
  localStorage.setItem("kwasuFocusData", JSON.stringify(focusData));
}

/* ---------------------------------
   FORMAT TIME
--------------------------------- */

function formatTimerTime(seconds) {
  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function formatFocusHours(seconds) {
  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours}h ${minutes}m`;
}

/* ---------------------------------
   UPDATE DISPLAY
--------------------------------- */

function updateTimerDisplay() {
  if (!timerDisplay) {
    return;
  }

  timerDisplay.textContent = formatTimerTime(timerRemaining);

  const progress = ((timerDuration - timerRemaining) / timerDuration) * 100;

  if (timerProgress) {
    timerProgress.style.width = `${Math.max(0, Math.min(100, progress))}%`;
  }

  document.title = timerRunning
    ? `${formatTimerTime(timerRemaining)} • KWASU Focus`
    : "KWASU Student Companion";
}

/* ---------------------------------
   UPDATE STATS
--------------------------------- */

function updateFocusStats() {
  resetDailyFocusIfNeeded();

  if (todayFocusTime) {
    todayFocusTime.textContent = formatFocusHours(focusData.totalSeconds);
  }

  if (completedSessions) {
    completedSessions.textContent = focusData.completedSessions;
  }

  if (currentSessionLength) {
    currentSessionLength.textContent = Math.ceil(timerDuration / 60);
  }
}

/* ---------------------------------
   UPDATE STATUS
--------------------------------- */

function setTimerStatus(status, message) {
  if (timerStatus) {
    timerStatus.textContent = status;

    timerStatus.className = "timer-status";

    if (status === "Running") {
      timerStatus.classList.add("running");
    }

    if (status === "Paused") {
      timerStatus.classList.add("paused");
    }

    if (status === "Completed") {
      timerStatus.classList.add("finished");
    }
  }

  if (timerMessage) {
    timerMessage.textContent = message;
  }
}

/* ---------------------------------
   START TIMER
--------------------------------- */

function startFocusTimer() {
  if (timerRunning) {
    return;
  }

  if (timerRemaining <= 0) {
    resetFocusTimer();
  }

  timerRunning = true;
  timerPaused = false;

  if (timerStartButton) {
    timerStartButton.textContent = "Pause";
  }

  setTimerStatus("Running", "Stay focused. You've got this.");

  timerInterval = setInterval(() => {
    timerRemaining--;

    updateTimerDisplay();

    /*
     * Count actual focused seconds.
     */
    focusData.totalSeconds++;

    saveFocusData();

    updateFocusStats();

    if (timerRemaining <= 0) {
      finishFocusTimer();
    }
  }, 1000);
}

/* ---------------------------------
   PAUSE TIMER
--------------------------------- */

function pauseFocusTimer() {
  if (!timerRunning) {
    return;
  }

  clearInterval(timerInterval);

  timerInterval = null;

  timerRunning = false;
  timerPaused = true;

  if (timerStartButton) {
    timerStartButton.textContent = "Resume";
  }

  setTimerStatus("Paused", "Your session is paused.");
}

/* ---------------------------------
   START / PAUSE BUTTON
--------------------------------- */

if (timerStartButton) {
  timerStartButton.addEventListener("click", () => {
    if (timerRunning) {
      pauseFocusTimer();
    } else {
      startFocusTimer();
    }
  });
}

/* ---------------------------------
   RESET TIMER
--------------------------------- */

function resetFocusTimer() {
  clearInterval(timerInterval);

  timerInterval = null;

  timerRunning = false;
  timerPaused = false;

  timerRemaining = timerDuration;

  if (timerStartButton) {
    timerStartButton.textContent = "Start Focus";
  }

  setTimerStatus("Ready", "Ready when you are. Start your study session.");

  updateTimerDisplay();
  updateFocusStats();
}

if (timerResetButton) {
  timerResetButton.addEventListener("click", resetFocusTimer);
}

/* ---------------------------------
   COMPLETE SESSION
--------------------------------- */

function finishFocusTimer() {
  clearInterval(timerInterval);

  timerInterval = null;

  timerRunning = false;
  timerPaused = false;

  timerRemaining = 0;

  focusData.completedSessions++;

  saveFocusData();

  if (timerStartButton) {
    timerStartButton.textContent = "Start Focus";
  }

  setTimerStatus("Completed", "Great work! Your focus session is complete.");

  updateTimerDisplay();
  updateFocusStats();

  /*
   * Small browser notification.
   * Works when browser permission is available.
   */
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("KWASU Focus Session Complete", {
      body: "Your study session is complete. Take a short break.",
    });
  } else {
    alert(
      "Focus session complete! 🎉\n\nTake a short break before your next session.",
    );
  }
}

/* ---------------------------------
   TIMER PRESETS
--------------------------------- */

timerPresets.forEach((preset) => {
  preset.addEventListener("click", () => {
    if (timerRunning) {
      return;
    }

    timerPresets.forEach((button) => {
      button.classList.remove("active");
    });

    preset.classList.add("active");

    const minutes = Number(preset.dataset.minutes);

    timerDuration = minutes * 60;

    timerRemaining = timerDuration;

    if (timerMode) {
      timerMode.textContent = `${minutes}-Minute Focus`;
    }

    updateTimerDisplay();
    updateFocusStats();

    setTimerStatus("Ready", `Ready for a ${minutes}-minute focus session.`);
  });
});

/* ---------------------------------
   CUSTOM TIMER
--------------------------------- */

if (setCustomTimer) {
  setCustomTimer.addEventListener("click", () => {
    if (timerRunning) {
      return;
    }

    const minutes = Number(customMinutes.value);

    if (!Number.isFinite(minutes) || minutes < 1 || minutes > 180) {
      alert("Please enter a time between 1 and 180 minutes.");

      return;
    }

    timerPresets.forEach((button) => {
      button.classList.remove("active");
    });

    timerDuration = minutes * 60;

    timerRemaining = timerDuration;

    if (timerMode) {
      timerMode.textContent = `${minutes}-Minute Focus`;
    }

    updateTimerDisplay();
    updateFocusStats();

    setTimerStatus("Ready", `Custom ${minutes}-minute session is ready.`);
  });
}

/* ---------------------------------
   INITIALIZE TIMER
--------------------------------- */

resetDailyFocusIfNeeded();

updateTimerDisplay();

updateFocusStats();

/* =========================
   ACADEMIC CALENDAR
========================= */

const academicCalendarEvents = [
  {
    date: "2026-01-22",
    title: "17th Matriculation Ceremony",
    type: "university",
    description:
      "The 17th Matriculation Ceremony for the 2025/2026 academic session.",
    location: "Mini Convocation Arena, KWASU Malete",
  },

  {
    date: "2026-01-21",
    title: "Matriculation Gown Collection",
    type: "student",
    description:
      "Matriculating students can collect their academic gowns and Matriculation Oath forms.",
    location: "Respective Faculty Offices",
  },

  {
    date: "2026-01-23",
    title: "Matriculation Gown Return",
    type: "student",
    description:
      "Deadline for returning academic gowns after the matriculation ceremony.",
    location: "Respective Faculty Offices",
  },
];

const calendarGrid = document.getElementById("calendar-grid");
const calendarMonthYear = document.getElementById("calendar-month-year");
const calendarPrev = document.getElementById("calendar-prev");
const calendarNext = document.getElementById("calendar-next");
const calendarToday = document.getElementById("calendar-today");

const selectedDateTitle = document.getElementById("selected-date-title");
const selectedEventCount = document.getElementById("selected-event-count");
const calendarEventList = document.getElementById("calendar-event-list");

let calendarDate = new Date();
let selectedCalendarDate = new Date();

function formatCalendarDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatReadableDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getEventsForDate(dateString) {
  return academicCalendarEvents.filter((event) => event.date === dateString);
}

function getEventTypeLabel(type) {
  const labels = {
    academic: "Academic",
    university: "University",
    student: "Student",
  };

  return labels[type] || "Event";
}

function renderAcademicCalendar() {
  if (!calendarGrid || !calendarMonthYear) {
    return;
  }

  calendarGrid.innerHTML = "";

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarMonthYear.textContent = new Date(year, month, 1).toLocaleDateString(
    "en-NG",
    {
      month: "long",
      year: "numeric",
    },
  );

  // Empty spaces before the first day
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");

    emptyDay.className = "calendar-day empty";

    calendarGrid.appendChild(emptyDay);
  }

  // Calendar days
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDay = new Date(year, month, day);
    const dateString = formatCalendarDate(currentDay);

    const dayEvents = getEventsForDate(dateString);

    const dayElement = document.createElement("button");

    dayElement.type = "button";
    dayElement.className = "calendar-day";

    if (formatCalendarDate(new Date()) === dateString) {
      dayElement.classList.add("today");
    }

    if (formatCalendarDate(selectedCalendarDate) === dateString) {
      dayElement.classList.add("selected");
    }

    let eventDots = "";

    dayEvents.forEach((event) => {
      eventDots += `
                <span class="calendar-event-dot ${event.type}"></span>
            `;
    });

    const preview = dayEvents.length > 0 ? dayEvents[0].title : "";

    dayElement.innerHTML = `
            <div class="calendar-day-number">
                <span>${day}</span>
            </div>

            ${
              dayEvents.length > 0
                ? `
                    <div class="calendar-event-dots">
                        ${eventDots}
                    </div>

                    <div class="calendar-event-preview">
                        ${preview}
                    </div>
                    `
                : ""
            }
        `;

    dayElement.addEventListener("click", () => {
      selectedCalendarDate = currentDay;

      renderAcademicCalendar();
      renderSelectedDateEvents(dateString);
    });

    calendarGrid.appendChild(dayElement);
  }
}

function renderSelectedDateEvents(dateString) {
  if (!selectedDateTitle || !selectedEventCount || !calendarEventList) {
    return;
  }

  const events = getEventsForDate(dateString);

  selectedDateTitle.textContent = formatReadableDate(dateString);

  selectedEventCount.textContent = `${events.length} ${events.length === 1 ? "Event" : "Events"}`;

  if (events.length === 0) {
    calendarEventList.innerHTML = `
            <div class="calendar-empty-state">
                <span>📅</span>
                <h4>No events on this date</h4>
                <p>
                    There are no academic events currently listed
                    for this date.
                </p>
            </div>
        `;

    return;
  }

  calendarEventList.innerHTML = events
    .map(
      (event) => `
                <div class="calendar-event-item">

                    <span class="calendar-event-type ${event.type}">
                        ${getEventTypeLabel(event.type)}
                    </span>

                    <h4>${event.title}</h4>

                    <p>
                        ${event.description}
                    </p>

                    <div class="calendar-event-date">
                        📍 ${event.location}
                    </div>

                </div>
            `,
    )
    .join("");
}

/* PREVIOUS MONTH */

if (calendarPrev) {
  calendarPrev.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);

    renderAcademicCalendar();
  });
}

/* NEXT MONTH */

if (calendarNext) {
  calendarNext.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);

    renderAcademicCalendar();
  });
}

/* TODAY */

if (calendarToday) {
  calendarToday.addEventListener("click", () => {
    calendarDate = new Date();
    selectedCalendarDate = new Date();

    const todayString = formatCalendarDate(new Date());

    renderAcademicCalendar();
    renderSelectedDateEvents(todayString);
  });
}

/* INITIALIZE CALENDAR */

if (calendarGrid) {
  const initialDateString = formatCalendarDate(selectedCalendarDate);

  renderAcademicCalendar();
  renderSelectedDateEvents(initialDateString);
}

/* =========================
   IMPORTANT CONTACTS
========================= */

const kwasuContacts = [
  {
    name: "KWASU General Contact",
    category: "support",
    icon: "🏫",
    description: "General enquiries and official university contact.",
    phone: "+234 803 191 5699",
    email: "ur@kwasu.edu.ng",
  },

  {
    name: "Admissions Office",
    category: "academic",
    icon: "🎓",
    description:
      "For admission enquiries, screening and undergraduate admission support.",
    phone: "08127202297",
    email: "admissions@kwasu.edu.ng",
  },

  {
    name: "Admissions Office — Support",
    category: "academic",
    icon: "📋",
    description:
      "Additional contact for admission enquiries and screening support.",
    phone: "07059608072",
    email: "admissions@kwasu.edu.ng",
  },

  {
    name: "SERVICOM",
    category: "student",
    icon: "🤝",
    description:
      "For service delivery concerns, complaints and student service issues.",
    phone: "07044497063",
    email: "Director.SERVICOM@kwasu.edu.ng",
  },

  {
    name: "ICT Support",
    category: "support",
    icon: "💻",
    description: "Technology and ICT-related support within the university.",
    phone: "+234 803 191 5699",
    email: "ur@kwasu.edu.ng",
  },

  {
    name: "KWASU Main Campus",
    category: "student",
    icon: "📍",
    description: "Main university campus in Malete, Kwara State.",
    phone: "+234 803 191 5699",
    email: "ur@kwasu.edu.ng",
  },

  {
    name: "Faculty of ICT",
    category: "academic",
    icon: "🖥️",
    description:
      "Faculty contact for Information and Communication Technology.",
    phone: "+2348033788999",
    email: "Isiaka.aliagan@kwasu.edu.ng",
  },

  {
    name: "KWASU SERVICOM — Support",
    category: "student",
    icon: "📞",
    description: "Additional SERVICOM contact for service-related enquiries.",
    phone: "07043268180",
    email: "SERVICOM.info@kwasu.edu.ng",
  },
];

const contactsGrid = document.getElementById("contacts-grid");
const contactSearch = document.getElementById("contact-search");
const clearContactSearch = document.getElementById("clear-contact-search");
const contactResultCount = document.getElementById("contact-result-count");
const contactsNoResults = document.getElementById("contacts-no-results");

let activeContactCategory = "all";

function escapeContactText(text) {
  const div = document.createElement("div");
  div.textContent = text;

  return div.innerHTML;
}

function getContactCategoryLabel(category) {
  const labels = {
    academic: "Academic",
    support: "Support",
    student: "Student Services",
  };

  return labels[category] || "Contact";
}

function renderContacts() {
  if (!contactsGrid) {
    return;
  }

  const searchTerm = contactSearch
    ? contactSearch.value.trim().toLowerCase()
    : "";

  const filteredContacts = kwasuContacts.filter((contact) => {
    const matchesCategory =
      activeContactCategory === "all" ||
      contact.category === activeContactCategory;

    const searchableText = `
            ${contact.name}
            ${contact.description}
            ${contact.phone}
            ${contact.email}
            ${getContactCategoryLabel(contact.category)}
        `.toLowerCase();

    const matchesSearch =
      searchTerm === "" || searchableText.includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  contactsGrid.innerHTML = "";

  if (contactResultCount) {
    contactResultCount.textContent = `${filteredContacts.length} ${
      filteredContacts.length === 1 ? "contact" : "contacts"
    }`;
  }

  if (contactsNoResults) {
    contactsNoResults.hidden = filteredContacts.length !== 0;
  }

  filteredContacts.forEach((contact) => {
    const phoneNumber = contact.phone.replace(/\s+/g, "");

    const card = document.createElement("article");

    card.className = "contact-card";

    card.innerHTML = `
            <div class="contact-card-top">
                <div class="contact-icon">
                    ${contact.icon}
                </div>

                <span class="contact-category">
                    ${getContactCategoryLabel(contact.category)}
                </span>
            </div>

            <h4>
                ${escapeContactText(contact.name)}
            </h4>

            <p class="contact-description">
                ${escapeContactText(contact.description)}
            </p>

            <div class="contact-details">

                <div class="contact-detail">
                    <span>📞</span>
                    <a href="tel:${phoneNumber}">
                        ${escapeContactText(contact.phone)}
                    </a>
                </div>

                <div class="contact-detail">
                    <span>✉️</span>
                    <a href="mailto:${contact.email}">
                        ${escapeContactText(contact.email)}
                    </a>
                </div>

            </div>

            <div class="contact-actions">

                <a
                    href="tel:${phoneNumber}"
                    class="contact-action call"
                >
                    📞 Call
                </a>

                <a
                    href="mailto:${contact.email}"
                    class="contact-action email"
                >
                    ✉️ Email
                </a>

            </div>
        `;

    contactsGrid.appendChild(card);
  });
}

/* SEARCH */

if (contactSearch) {
  contactSearch.addEventListener("input", () => {
    renderContacts();
  });
}

/* CLEAR SEARCH */

if (clearContactSearch) {
  clearContactSearch.addEventListener("click", () => {
    if (contactSearch) {
      contactSearch.value = "";
      contactSearch.focus();
    }

    renderContacts();
  });
}

/* CATEGORY FILTERS */

const contactFilters = document.querySelectorAll(".contact-filter");

contactFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    contactFilters.forEach((button) => {
      button.classList.remove("active");
    });

    filter.classList.add("active");

    activeContactCategory = filter.dataset.contactCategory;

    renderContacts();
  });
});

/* INITIALIZE CONTACTS */

if (contactsGrid) {
  renderContacts();
}

/* =========================
   FACULTY & DEPARTMENT DIRECTORY
========================= */

const kwasuDirectory = [
  {
    faculty: "Faculty of Agriculture",
    icon: "🌱",
    departments: [
      {
        name: "Agricultural Economics & Extension Services",
        programmes: [
          "B. Agric. Agricultural Economics",
          "B. Agric. Agricultural Extension",
        ],
      },
      {
        name: "Animal Production, Fisheries & Aquaculture",
        programmes: ["B. Agric. Animal Production"],
      },
      {
        name: "Crop Production",
        programmes: ["B. Agric. Crop Production", "B. Agric. Crop Protection"],
      },
      {
        name: "Food Science & Technology",
        programmes: ["B.Sc. Food Science & Technology"],
      },
    ],
  },

  {
    faculty: "Faculty of Arts",
    icon: "🎨",
    departments: [
      {
        name: "Arabic and French",
        programmes: ["B.A. Arabic Studies", "B.A. French"],
      },
      {
        name: "English and Linguistics",
        programmes: [
          "B.A. English",
          "B.A. Linguistics",
          "B.A. Linguistics/Yoruba",
        ],
      },
      {
        name: "Fine and Applied Arts",
        programmes: ["B.A. Fine and Applied Arts"],
      },
      {
        name: "Performing Arts and Film Studies",
        programmes: ["B.A. Performing Arts"],
      },
      {
        name: "Religions, History and Heritage Studies",
        programmes: [
          "History and Diplomatic Studies",
          "Islamic Studies",
          "Christian Studies",
        ],
      },
    ],
  },

  {
    faculty: "Faculty of Education",
    icon: "📚",
    departments: [
      {
        name: "Business and Entrepreneurship Education",
        programmes: ["B.Ed. Business Education"],
      },
      {
        name: "Special Education",
        programmes: ["B.Sc. (Ed) Special Education"],
      },
      {
        name: "Human Kinetics and Health Education",
        programmes: ["B.Ed. Human Kinetics and Health Education"],
      },
      {
        name: "Early Childhood and Primary Education",
        programmes: ["B.Ed. Early Childhood and Primary Education"],
      },
    ],
  },

  {
    faculty: "Faculty of Engineering and Technology",
    icon: "⚙️",
    departments: [
      {
        name: "Mechanical Engineering",
        programmes: ["B.Eng. Mechanical Engineering"],
      },
      {
        name: "Materials Science and Engineering",
        programmes: ["B.Eng. Materials Science and Engineering"],
      },
      {
        name: "Civil and Environmental Engineering",
        programmes: ["B.Eng. Civil and Environmental Engineering"],
      },
      {
        name: "Electrical and Computer Engineering",
        programmes: ["B.Eng. Electrical and Computer Engineering"],
      },
      {
        name: "Food and Agricultural Engineering",
        programmes: ["B.Eng. Food and Agricultural Engineering"],
      },
      {
        name: "Aeronautical and Astronautical Engineering",
        programmes: ["B.Eng. Aeronautical and Astronautical Engineering"],
      },
    ],
  },

  {
    faculty: "Faculty of Information and Communication Technology",
    icon: "💻",
    departments: [
      {
        name: "Computer Science",
        programmes: ["B.Eng. Computer Science"],
      },
      {
        name: "Library and Information Science",
        programmes: ["B.Eng. Library and Information Science"],
      },
      {
        name: "Mass Communication",
        programmes: ["B.Eng. Mass Communication"],
      },
    ],
  },

  {
    faculty: "Faculty of Law",
    icon: "⚖️",
    departments: [
      {
        name: "Business & Private Law",
        programmes: ["LLB. Common Law", "LLB. Common Law and Islamic Law"],
      },
      {
        name: "Jurisprudence & Public Law",
        programmes: ["LLB. Common Law", "LLB. Common Law and Islamic Law"],
      },
    ],
  },

  {
    faculty: "Faculty of Management and Social Science",
    icon: "📊",
    departments: [
      {
        name: "Accounting and Finance",
        programmes: ["B.Sc. Accounting", "B.Sc. Finance"],
      },
      {
        name: "Economics and Development Studies",
        programmes: ["B.Sc. Economics"],
      },
      {
        name: "Business and Entrepreneurship",
        programmes: ["B.Sc. Entrepreneurship", "B.Sc. Business Administration"],
      },
      {
        name: "Tourism and Hospitality Management",
        programmes: ["B.Sc. Tourism and Hospitality Management"],
      },
      {
        name: "Politics and Governance",
        programmes: ["B.Sc. Political Science", "B.Sc. Public Administration"],
      },
    ],
  },

  {
    faculty: "Faculty of Pure and Applied Science",
    icon: "🔬",
    departments: [
      {
        name: "Microbiology",
        programmes: ["B.Sc. Microbiology"],
      },
      {
        name: "Biochemistry",
        programmes: ["B.Sc. Biochemistry"],
      },
      {
        name: "Zoology",
        programmes: ["B.Sc. Zoology"],
      },
      {
        name: "Chemical, Geological and Physical Sciences",
        programmes: ["B.Sc. Physical and Material Science"],
      },
      {
        name: "Geology and Mineral Sciences",
        programmes: ["B.Sc. Geology and Mineral Science"],
      },
      {
        name: "Chemistry and Industrial Chemistry",
        programmes: ["B.Sc. Chemistry", "B.Sc. Industrial Chemistry"],
      },
      {
        name: "Environmental Management and Toxicology",
        programmes: ["B.Sc. Environmental Management and Toxicology"],
      },
      {
        name: "Mathematics and Statistics",
        programmes: ["B.Sc. Mathematics", "B.Sc. Statistics"],
      },
      {
        name: "Plant and Environmental Biology",
        programmes: ["B.Sc. Plant and Environmental Biology"],
      },
    ],
  },
];

const departmentSearch = document.getElementById("department-search");

const clearDepartmentSearch = document.getElementById(
  "clear-department-search",
);

const facultySelect = document.getElementById("faculty-select");

const facultyDirectoryGrid = document.getElementById("faculty-directory-grid");

const directoryResultsTitle = document.getElementById(
  "directory-results-title",
);

const directoryResultCount = document.getElementById("directory-result-count");

const directoryNoResults = document.getElementById("directory-no-results");

/* GET ALL DEPARTMENTS */

function getAllDepartments() {
  const departments = [];

  kwasuDirectory.forEach((faculty) => {
    faculty.departments.forEach((department) => {
      departments.push({
        ...department,
        faculty: faculty.faculty,
        icon: faculty.icon,
      });
    });
  });

  return departments;
}

/* ESCAPE TEXT */

function escapeDirectoryText(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

/* CREATE FACULTY FILTER OPTIONS */

function populateFacultySelect() {
  if (!facultySelect) {
    return;
  }

  kwasuDirectory.forEach((faculty) => {
    const option = document.createElement("option");

    option.value = faculty.faculty;
    option.textContent = faculty.faculty;

    facultySelect.appendChild(option);
  });
}

/* RENDER DIRECTORY */

function renderFacultyDirectory() {
  if (!facultyDirectoryGrid) {
    return;
  }

  const searchTerm = departmentSearch
    ? departmentSearch.value.trim().toLowerCase()
    : "";

  const selectedFaculty = facultySelect ? facultySelect.value : "all";

  const allDepartments = getAllDepartments();

  const filteredDepartments = allDepartments.filter((department) => {
    const matchesFaculty =
      selectedFaculty === "all" || department.faculty === selectedFaculty;

    const searchableText = `
                ${department.faculty}
                ${department.name}
                ${department.programmes.join(" ")}
            `.toLowerCase();

    const matchesSearch =
      searchTerm === "" || searchableText.includes(searchTerm);

    return matchesFaculty && matchesSearch;
  });

  facultyDirectoryGrid.innerHTML = "";

  if (directoryResultsTitle) {
    directoryResultsTitle.textContent =
      selectedFaculty === "all" ? "All Faculties" : selectedFaculty;
  }

  if (directoryResultCount) {
    directoryResultCount.textContent = `${filteredDepartments.length} ${
      filteredDepartments.length === 1 ? "department" : "departments"
    }`;
  }

  if (directoryNoResults) {
    directoryNoResults.hidden = filteredDepartments.length !== 0;
  }

  filteredDepartments.forEach((department) => {
    const card = document.createElement("article");

    card.className = "department-card";

    const programmeTags = department.programmes
      .map(
        (programme) => `
                    <span class="programme-tag">
                        ${escapeDirectoryText(programme)}
                    </span>
                `,
      )
      .join("");

    card.innerHTML = `
            <div class="department-card-top">

                <div class="department-icon">
                    ${department.icon}
                </div>

                <span class="department-faculty">
                    ${escapeDirectoryText(department.faculty)}
                </span>

            </div>

            <h4>
                ${escapeDirectoryText(department.name)}
            </h4>

            <p class="department-card-description">
                Explore programmes and academic information
                connected to this department.
            </p>

            <div class="department-programmes">

                <span class="department-programmes-label">
                    Programmes
                </span>

                <div class="programme-tags">
                    ${programmeTags}
                </div>

            </div>

            <div class="department-count">
                ${department.programmes.length}
                ${
                  department.programmes.length === 1
                    ? "programme"
                    : "programmes"
                }
            </div>
        `;

    facultyDirectoryGrid.appendChild(card);
  });
}

/* SEARCH */

if (departmentSearch) {
  departmentSearch.addEventListener("input", () => {
    renderFacultyDirectory();
  });
}

/* CLEAR SEARCH */

if (clearDepartmentSearch) {
  clearDepartmentSearch.addEventListener("click", () => {
    if (departmentSearch) {
      departmentSearch.value = "";
      departmentSearch.focus();
    }

    renderFacultyDirectory();
  });
}

/* FACULTY FILTER */

if (facultySelect) {
  facultySelect.addEventListener("change", () => {
    renderFacultyDirectory();
  });
}

/* INITIALIZE */

if (facultyDirectoryGrid) {
  populateFacultySelect();
  renderFacultyDirectory();
}

/* ================= STUDENT BUDGET ================= */

const budgetStorageKey = "kwasuStudentBudget";

let budgetData = {
  monthlyBudget: 0,
  expenses: [],
};

const categoryInfo = {
  food: {
    name: "Food",
    icon: "🍲",
  },

  transport: {
    name: "Transport",
    icon: "🚌",
  },

  data: {
    name: "Data",
    icon: "📱",
  },

  school: {
    name: "School",
    icon: "📚",
  },

  accommodation: {
    name: "Accommodation",
    icon: "🏠",
  },

  personal: {
    name: "Personal",
    icon: "🛍️",
  },

  other: {
    name: "Other",
    icon: "📦",
  },
};

/* LOAD SAVED BUDGET */

function loadBudgetData() {
  const savedBudget = localStorage.getItem(budgetStorageKey);

  if (savedBudget) {
    try {
      budgetData = JSON.parse(savedBudget);
    } catch (error) {
      budgetData = {
        monthlyBudget: 0,
        expenses: [],
      };
    }
  }

  updateBudgetUI();
}

/* SAVE BUDGET */

function saveBudgetData() {
  localStorage.setItem(budgetStorageKey, JSON.stringify(budgetData));
}

/* FORMAT MONEY */

function formatBudgetMoney(amount) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

/* TOTAL SPENT */

function getTotalSpent() {
  return budgetData.expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0,
  );
}

/* UPDATE EVERYTHING */

function updateBudgetUI() {
  const totalBudget = Number(budgetData.monthlyBudget) || 0;
  const totalSpent = getTotalSpent();

  const remaining = Math.max(totalBudget - totalSpent, 0);

  let percentage = 0;

  if (totalBudget > 0) {
    percentage = Math.round((totalSpent / totalBudget) * 100);
  }

  const budgetTotal = document.getElementById("budget-total");
  const budgetSpentText = document.getElementById("budget-spent-text");
  const budgetPercent = document.getElementById("budget-percent");
  const budgetProgressBar = document.getElementById("budget-progress-bar");
  const budgetRemaining = document.getElementById("budget-remaining");
  const budgetStatus = document.getElementById("budget-status");

  const totalSpentElement = document.getElementById("total-spent");
  const totalRemainingElement = document.getElementById("total-remaining");

  if (budgetTotal) {
    budgetTotal.textContent = formatBudgetMoney(totalBudget);
  }

  if (budgetSpentText) {
    budgetSpentText.textContent = `${formatBudgetMoney(totalSpent)} spent`;
  }

  if (budgetPercent) {
    budgetPercent.textContent = `${Math.min(percentage, 100)}%`;
  }

  if (budgetProgressBar) {
    budgetProgressBar.style.width = `${Math.min(percentage, 100)}%`;
  }

  if (budgetRemaining) {
    budgetRemaining.textContent = formatBudgetMoney(remaining);
  }

  if (totalSpentElement) {
    totalSpentElement.textContent = formatBudgetMoney(totalSpent);
  }

  if (totalRemainingElement) {
    totalRemainingElement.textContent = formatBudgetMoney(remaining);
  }

  /* STATUS */

  if (budgetStatus) {
    if (totalBudget === 0) {
      budgetStatus.textContent = "Set your budget";
    } else if (totalSpent === 0) {
      budgetStatus.textContent = "Ready to start";
    } else if (percentage < 50) {
      budgetStatus.textContent = "Looking good";
    } else if (percentage < 80) {
      budgetStatus.textContent = "Keep an eye on spending";
    } else if (percentage < 100) {
      budgetStatus.textContent = "Budget getting low";
    } else {
      budgetStatus.textContent = "Budget exceeded";
    }
  }

  updateBudgetCategories();
  updateExpenseList();
  updateBudgetInsight();
}

/* CATEGORY BREAKDOWN */

function updateBudgetCategories() {
  const categoryElements = document.querySelectorAll(".budget-category");

  const totalSpent = getTotalSpent();

  categoryElements.forEach((element) => {
    const titleElement = element.querySelector("strong");

    const amountElement = element.querySelector(
      ".budget-category-info div span",
    );

    const bar = element.querySelector(".category-bar div");

    if (!titleElement || !amountElement || !bar) {
      return;
    }

    const categoryName = titleElement.textContent.trim();

    const categoryKey = Object.keys(categoryInfo).find(
      (key) => categoryInfo[key].name === categoryName,
    );

    if (!categoryKey) {
      return;
    }

    const categoryTotal = budgetData.expenses
      .filter((expense) => expense.category === categoryKey)
      .reduce((total, expense) => total + Number(expense.amount), 0);

    const percentage =
      totalSpent > 0 ? Math.round((categoryTotal / totalSpent) * 100) : 0;

    amountElement.textContent = formatBudgetMoney(categoryTotal);

    bar.style.width = `${percentage}%`;
  });
}

/* ADD EXPENSE */

function addBudgetExpense() {
  const nameInput = document.getElementById("expense-name");

  const categoryInput = document.getElementById("expense-category");

  const amountInput = document.getElementById("expense-amount");

  const name = nameInput.value.trim();

  const category = categoryInput.value;

  const amount = Number(amountInput.value);

  if (!name) {
    alert("Please enter the expense name.");
    nameInput.focus();
    return;
  }

  if (!amount || amount <= 0) {
    alert("Please enter a valid expense amount.");
    amountInput.focus();
    return;
  }

  const newExpense = {
    id: Date.now(),
    name: name,
    category: category,
    amount: amount,
    date: new Date().toISOString(),
  };

  budgetData.expenses.unshift(newExpense);

  saveBudgetData();
  updateBudgetUI();

  nameInput.value = "";
  amountInput.value = "";

  nameInput.focus();
}

/* EXPENSE LIST */

function updateExpenseList() {
  const expenseList = document.getElementById("expense-list");

  const emptyExpenses = document.getElementById("empty-expenses");

  const expenseCount = document.getElementById("expense-count");

  if (!expenseList) {
    return;
  }

  expenseList.innerHTML = "";

  if (expenseCount) {
    expenseCount.textContent = `${budgetData.expenses.length} ${
      budgetData.expenses.length === 1 ? "expense" : "expenses"
    }`;
  }

  if (budgetData.expenses.length === 0) {
    if (emptyExpenses) {
      emptyExpenses.style.display = "block";
    }

    return;
  }

  if (emptyExpenses) {
    emptyExpenses.style.display = "none";
  }

  budgetData.expenses.slice(0, 10).forEach((expense) => {
    const info = categoryInfo[expense.category] || categoryInfo.other;

    const item = document.createElement("div");

    item.className = "expense-item";

    const date = new Date(expense.date);

    const formattedDate = date.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
    });

    item.innerHTML = `
                <div class="expense-left">

                    <div class="expense-icon">
                        ${info.icon}
                    </div>

                    <div class="expense-details">
                        <strong>${escapeBudgetText(expense.name)}</strong>
                        <span>
                            ${info.name} • ${formattedDate}
                        </span>
                    </div>

                </div>

                <div class="expense-right">

                    <span class="expense-amount">
                        ${formatBudgetMoney(expense.amount)}
                    </span>

                    <button
                        type="button"
                        class="delete-expense"
                        data-expense-id="${expense.id}"
                        aria-label="Delete expense"
                    >
                        ×
                    </button>

                </div>
            `;

    expenseList.appendChild(item);
  });

  document.querySelectorAll(".delete-expense").forEach((button) => {
    button.addEventListener("click", () => {
      const expenseId = Number(button.dataset.expenseId);

      deleteBudgetExpense(expenseId);
    });
  });
}

/* DELETE EXPENSE */

function deleteBudgetExpense(id) {
  budgetData.expenses = budgetData.expenses.filter(
    (expense) => expense.id !== id,
  );

  saveBudgetData();
  updateBudgetUI();
}

/* BUDGET INSIGHT */

function updateBudgetInsight() {
  const title = document.getElementById("budget-insight-title");

  const text = document.getElementById("budget-insight-text");

  const remainingElement = document.getElementById("insight-remaining");

  const budget = Number(budgetData.monthlyBudget) || 0;

  const spent = getTotalSpent();

  const remaining = Math.max(budget - spent, 0);

  if (remainingElement) {
    remainingElement.textContent = formatBudgetMoney(remaining);
  }

  if (!title || !text) {
    return;
  }

  if (budget === 0) {
    title.textContent = "Start planning your month.";

    text.textContent =
      "Set your monthly budget and start tracking your expenses to see your spending insights here.";

    return;
  }

  const percentage = (spent / budget) * 100;

  if (spent === 0) {
    title.textContent = "Your budget is ready.";

    text.textContent = `You have ${formatBudgetMoney(budget)} available this month. Start adding your expenses to keep track of your spending.`;
  } else if (percentage < 50) {
    title.textContent = "You're off to a good start.";

    text.textContent = `You've used ${Math.round(percentage)}% of your budget. You still have ${formatBudgetMoney(remaining)} available.`;
  } else if (percentage < 80) {
    title.textContent = "Keep an eye on your spending.";

    text.textContent = `You've used ${Math.round(percentage)}% of your budget. Try to keep your remaining spending within ${formatBudgetMoney(remaining)}.`;
  } else if (percentage < 100) {
    title.textContent = "Your budget is getting low.";

    text.textContent = `You've used ${Math.round(percentage)}% of your monthly budget. You have ${formatBudgetMoney(remaining)} left.`;
  } else {
    title.textContent = "You've gone over budget.";

    text.textContent = `Your spending has reached ${formatBudgetMoney(spent)}, which is above your planned budget of ${formatBudgetMoney(budget)}.`;
  }
}

/* SAVE MONTHLY BUDGET */

function saveMonthlyBudget() {
  const budgetInput = document.getElementById("monthly-budget");

  const amount = Number(budgetInput.value);

  if (!amount || amount <= 0) {
    alert("Please enter a valid monthly budget.");

    budgetInput.focus();

    return;
  }

  budgetData.monthlyBudget = amount;

  saveBudgetData();
  updateBudgetUI();

  budgetInput.value = "";

  alert(`Your monthly budget has been set to ${formatBudgetMoney(amount)}.`);
}

/* RESET */

function resetBudgetData() {
  const confirmed = confirm(
    "Are you sure you want to delete your budget and all recorded expenses?",
  );

  if (!confirmed) {
    return;
  }

  budgetData = {
    monthlyBudget: 0,
    expenses: [],
  };

  saveBudgetData();
  updateBudgetUI();
}

/* ESCAPE USER TEXT */

function escapeBudgetText(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

/* EVENT LISTENERS */

const saveBudgetButton = document.getElementById("save-budget");

if (saveBudgetButton) {
  saveBudgetButton.addEventListener("click", saveMonthlyBudget);
}

const addExpenseButton = document.getElementById("add-expense");

if (addExpenseButton) {
  addExpenseButton.addEventListener("click", addBudgetExpense);
}

const resetBudgetButton = document.getElementById("reset-budget");

if (resetBudgetButton) {
  resetBudgetButton.addEventListener("click", resetBudgetData);
}

/* LOAD BUDGET WHEN PAGE STARTS */

loadBudgetData();

/* =========================================================
   DATA / INTERNET CALCULATOR
   ========================================================= */

/* =========================
   CONTRIBUTORS SLIDER
========================= */

const contributorSlides = document.querySelectorAll(".contributors-slide");
const contributorDots = document.querySelectorAll(".contributor-dot");
const contributorPrev = document.getElementById("contributors-prev");
const contributorNext = document.getElementById("contributors-next");

let currentContributorSlide = 0;
let contributorAutoPlay;

function showContributorSlide(index) {
  if (!contributorSlides.length) return;

  if (index < 0) {
    index = contributorSlides.length - 1;
  }

  if (index >= contributorSlides.length) {
    index = 0;
  }

  currentContributorSlide = index;

  contributorSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === currentContributorSlide);
  });

  contributorDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentContributorSlide);
  });
}

function nextContributorSlide() {
  showContributorSlide(currentContributorSlide + 1);
}

function previousContributorSlide() {
  showContributorSlide(currentContributorSlide - 1);
}

function startContributorAutoPlay() {
  clearInterval(contributorAutoPlay);

  contributorAutoPlay = setInterval(() => {
    nextContributorSlide();
  }, 6000);
}

if (contributorNext) {
  contributorNext.addEventListener("click", () => {
    nextContributorSlide();
    startContributorAutoPlay();
  });
}

if (contributorPrev) {
  contributorPrev.addEventListener("click", () => {
    previousContributorSlide();
    startContributorAutoPlay();
  });
}

contributorDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showContributorSlide(index);
    startContributorAutoPlay();
  });
});

if (contributorSlides.length) {
  showContributorSlide(0);
  startContributorAutoPlay();
}

/* =========================
   FACULTY WI-FI DIRECTORY
========================= */

const wifiGrid = document.getElementById("wifi-grid");
const wifiSearch = document.getElementById("wifi-search");
const clearWifiSearch = document.getElementById("clear-wifi-search");
const wifiFacultyFilter = document.getElementById("wifi-faculty-filter");
const wifiResultCount = document.getElementById("wifi-result-count");
const wifiNoResults = document.getElementById("wifi-no-results");

const facultyWifiData = [
  {
    name: "Faculty of Agriculture",
    category: "Agriculture",
    description:
      "Academic faculty covering agriculture, food production and related agricultural studies.",
    network: "KWASU-AGRIC",
    password: "KWASU-DEMO-AGRIC",
    location: "Agriculture Complex",
  },

  {
    name: "Faculty of Allied Health Sciences",
    category: "Health Sciences",
    description:
      "Faculty supporting programmes and training in allied health and community health fields.",
    network: "KWASU-ALLIED",
    password: "KWASU-DEMO-ALLIED",
    location: "College of Health Sciences",
  },

  {
    name: "Faculty of Arts",
    category: "Arts",
    description:
      "Faculty covering languages, humanities, creative arts, history and related disciplines.",
    network: "KWASU-ARTS",
    password: "KWASU-DEMO-ARTS",
    location: "Arts Complex",
  },

  {
    name: "Faculty of Basic Medical Sciences",
    category: "Health Sciences",
    description:
      "Faculty supporting foundational medical science education and research.",
    network: "KWASU-BMS",
    password: "KWASU-DEMO-BMS",
    location: "College of Health Sciences",
  },

  {
    name: "Faculty of Basic Clinical Sciences",
    category: "Health Sciences",
    description:
      "Faculty within the College of Health Sciences supporting clinical foundation studies.",
    network: "KWASU-BCS",
    password: "KWASU-DEMO-BCS",
    location: "College of Health Sciences",
  },

  {
    name: "Faculty of Clinical Sciences",
    category: "Health Sciences",
    description:
      "Faculty within the College of Health Sciences focused on clinical medical education.",
    network: "KWASU-CLINICAL",
    password: "KWASU-DEMO-CLINICAL",
    location: "College of Health Sciences",
  },

  {
    name: "Faculty of Education",
    category: "Education",
    description:
      "Faculty focused on teacher education, educational studies and professional development.",
    network: "KWASU-EDUCATION",
    password: "KWASU-DEMO-EDU",
    location: "Education Complex",
  },

  {
    name: "Faculty of Engineering and Technology",
    category: "Engineering",
    description:
      "Faculty covering engineering, technology and related applied disciplines.",
    network: "KWASU-ENGINEERING",
    password: "KWASU-DEMO-ENG",
    location: "Engineering Complex",
  },

  {
    name: "Faculty of Environmental Sciences",
    category: "Environmental Sciences",
    description:
      "Faculty covering environmental, built-environment and related professional disciplines.",
    network: "KWASU-ENVIRONMENT",
    password: "KWASU-DEMO-ENV",
    location: "Environmental Sciences Campus",
  },

  {
    name: "Faculty of Information and Communication Technology",
    category: "ICT",
    description:
      "Faculty covering computing, information science, communication and digital technologies.",
    network: "KWASU-ICT",
    password: "KWASU-DEMO-ICT",
    location: "ICT Complex",
  },

  {
    name: "Faculty of Law",
    category: "Law",
    description:
      "Faculty providing legal education and professional training in law.",
    network: "KWASU-LAW",
    password: "KWASU-DEMO-LAW",
    location: "Faculty of Law",
  },

  {
    name: "Faculty of Management and Social Sciences",
    category: "Management & Social Sciences",
    description:
      "Faculty covering management, economics, politics, entrepreneurship and related social sciences.",
    network: "KWASU-MSS",
    password: "KWASU-DEMO-MSS",
    location: "Management & Social Sciences Complex",
  },

  {
    name: "Faculty of Pure and Applied Sciences",
    category: "Science",
    description:
      "Faculty covering biological, chemical, physical, mathematical and environmental sciences.",
    network: "KWASU-SCIENCE",
    password: "KWASU-DEMO-SCIENCE",
    location: "Science Complex",
  },
];

/* =========================
   CREATE FACULTY FILTER
========================= */

function createWifiFacultyFilter() {
  if (!wifiFacultyFilter) return;

  const categories = [
    ...new Set(facultyWifiData.map((faculty) => faculty.category)),
  ];

  categories.forEach((category) => {
    const option = document.createElement("option");

    option.value = category;
    option.textContent = category;

    wifiFacultyFilter.appendChild(option);
  });
}

/* =========================
   RENDER WIFI CARDS
========================= */

function renderWifiCards() {
  if (!wifiGrid) return;

  const searchTerm = wifiSearch ? wifiSearch.value.trim().toLowerCase() : "";

  const selectedCategory = wifiFacultyFilter ? wifiFacultyFilter.value : "all";

  const filteredFaculties = facultyWifiData.filter((faculty) => {
    const matchesSearch =
      faculty.name.toLowerCase().includes(searchTerm) ||
      faculty.category.toLowerCase().includes(searchTerm) ||
      faculty.network.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategory === "all" || faculty.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  wifiGrid.innerHTML = "";

  filteredFaculties.forEach((faculty, index) => {
    const card = document.createElement("article");

    card.className = "wifi-card";

    card.innerHTML = `
            <div class="wifi-card-top">

                <div class="wifi-card-icon">
                    📶
                </div>

                <span class="wifi-status">
                    <span class="wifi-status-dot"></span>
                    Demo Network
                </span>

            </div>


            <span class="wifi-card-category">
                ${faculty.category}
            </span>


            <h3>
                ${faculty.name}
            </h3>


            <p class="wifi-card-description">
                ${faculty.description}
            </p>


            <div class="wifi-details">

                <div class="wifi-detail-row">

                    <span class="wifi-detail-label">
                        Network
                    </span>

                    <span class="wifi-detail-value">
                        ${faculty.network}
                    </span>

                </div>


                <div class="wifi-detail-row">

                    <span class="wifi-detail-label">
                        Password
                    </span>

                    <div class="wifi-password-value">

                        <span
                            class="wifi-password"
                            id="wifi-password-${index}"
                        >
                            ••••••••••••
                        </span>

                        <button
                            type="button"
                            class="wifi-show-password"
                            data-password="${faculty.password}"
                            data-target="wifi-password-${index}"
                            aria-label="Show password"
                        >
                            👁
                        </button>

                    </div>

                </div>

            </div>


            <div class="wifi-card-footer">

                <span class="wifi-location">
                    📍 ${faculty.location}
                </span>

                <button
                    type="button"
                    class="wifi-copy-btn"
                    data-password="${faculty.password}"
                >
                    Copy Password
                </button>

            </div>
        `;

    wifiGrid.appendChild(card);
  });

  updateWifiResultCount(filteredFaculties.length);

  if (wifiNoResults) {
    wifiNoResults.hidden = filteredFaculties.length !== 0;
  }
}

/* =========================
   RESULT COUNT
========================= */

function updateWifiResultCount(count) {
  if (!wifiResultCount) return;

  if (count === 1) {
    wifiResultCount.textContent = "1 faculty";
  } else {
    wifiResultCount.textContent = `${count} faculties`;
  }
}

/* =========================
   SHOW / HIDE PASSWORD
========================= */

document.addEventListener("click", (event) => {
  const button = event.target.closest(".wifi-show-password");

  if (!button) return;

  const targetId = button.dataset.target;
  const password = button.dataset.password;
  const target = document.getElementById(targetId);

  if (!target) return;

  if (target.textContent.includes("•")) {
    target.textContent = password;
    button.textContent = "🙈";
  } else {
    target.textContent = "••••••••••••";
    button.textContent = "👁";
  }
});

/* =========================
   COPY PASSWORD
========================= */

document.addEventListener("click", async (event) => {
  const button = event.target.closest(".wifi-copy-btn");

  if (!button) return;

  const password = button.dataset.password;

  try {
    await navigator.clipboard.writeText(password);

    const originalText = button.textContent;

    button.textContent = "Copied ✓";
    button.classList.add("copied");

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove("copied");
    }, 1500);
  } catch (error) {
    button.textContent = "Copy failed";

    setTimeout(() => {
      button.textContent = "Copy Password";
    }, 1500);
  }
});

/* =========================
   SEARCH
========================= */

if (wifiSearch) {
  wifiSearch.addEventListener("input", () => {
    renderWifiCards();
  });
}

/* =========================
   CLEAR SEARCH
========================= */

if (clearWifiSearch) {
  clearWifiSearch.addEventListener("click", () => {
    if (wifiSearch) {
      wifiSearch.value = "";
      wifiSearch.focus();
    }

    renderWifiCards();
  });
}

/* =========================
   FACULTY FILTER
========================= */

if (wifiFacultyFilter) {
  wifiFacultyFilter.addEventListener("change", () => {
    renderWifiCards();
  });
}

/* =========================
   START WIFI DIRECTORY
========================= */

createWifiFacultyFilter();
renderWifiCards();
