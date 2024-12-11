# **Birding Buddy - Web Scripting 2 Term Project**
**Name:** Samuel Park   
**Student Number:** A00943561
**Program:** BCIT - New Media Design & Web Development  
**Course:** Web Scripting 2 - Term Project  
 

## **Project Overview**
**Birding Buddy** is a bird-watching companion website developed as part of the Web Scripting 2 Term Project at BCIT. This application is to aid users to explore recent bird sightings (in British Columbia), view more information about each species and to maintain a personal checklist of birds they've seen. 

---

## **Features**

### **Home Page**
- A **search input field** to query recent bird sightings from the eBird API.
- A **list of bird sightings** displayed in a easy to read table, with links to detailed information for each bird as well as a quick access check box function.
- A **"My Checklist" button** for easy navigation to the saved checklist page.

### **Bird Details Page**
- Displays detailed information about a selected bird, including:
  - **Species Name** and **Scientific Name**
  - **Observation Info**
  - Displays the latest observation information, observation date, number of birds seen, location info with corresponding Google Map link, and observation validity.
- A **"Seen" button** allows users to add or remove the bird from their checklist.
- API integration via iNaturalist to fetch images for the selected bird for easier identification.

### **Checklist Page**
- Displays a user's saved checklist of birds.
- Users can uncheck the box for each bird to manage their checklist.
- Storage using **local storage** ensures data remains available across sessions.

---

## **Technologies Used**
- **React.js**: For building the user interface.
- **Tailwind CSS**: For responsive and customizable styling.
- **React Router**: For navigation between pages.
- **Font Awesome**: For icons in the UI.
- **eBird API**: For fetching bird sightings data.
- **iNaturalist API**: For fetching bird images.

---

## **Setup Instructions**

### **Prerequisites**
- Node.js installed on your machine.
- A code editor (e.g., VS Code).

### **Steps to Run**
1. Clone the repository:
    ```bash
    git clone https://github.com/ssypark/webscripting2-termproject.git

2. Navigate to the project directory
    ```bash
    cd webscripting2-termproject

3. Install dependencies:
    ```bash
    npm install

4. Start development server
    ```bash
    npm start

5. Open browser and navigate to provided URL: (eg.http://localhost:5000)

## Challenges and Solutions

1. ### **API Integration**
I had trouble ensuring reliable data was retrieved. Also, Ebird did not provide all the necessary data I needed to provide the experience I intended. Handling API errors were resolved for both APIs by implementing .catch blocks and display appropriate the appropriate fallback content when necessary.

2. ### **Unique Keys in Lists**
On the Checklist page, I faced trouble when rendering saved birds in the table via the map function. React required unique keys for list items to optimize rendering and to avoid bugs. I used the `speciesCode`  as the key wherever available and fell back to the array index with the logical OR (`||`) operator. This ensured all list items had a unique key and prevented React warnings.

## Credits
- Developed for Web Scripting 2 Term Project at BCIT.
- APIs used: eBird API and iNaturalist API.
- Icons by: Font Awesome.
- Styling framework: Tailwind CSS.