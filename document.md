**Lernova Documentation**

**Product Documentation**

**1. Functional Requirements**

**Admin Module**

The admin is the central authority of the Lernova platform. They have
complete control over managing trainers, students, and course materials.
The key responsibilities of an admin include:

-   **Creating and managing trainer accounts**: Admins can add new
    trainers, edit their details, and remove them when necessary.

-   **Uploading, editing, and deleting course materials**: Course
    materials, primarily in the form of PowerPoint presentations (PPTs),
    are managed by the admin. They can update content to keep courses
    relevant.

-   **Managing student records**: The admin maintains a record of all
    students enrolled in various batches. They can view student details,
    edit their information, and remove students when necessary.

-   **Assigning trainers to batches**: The admin is responsible for
    ensuring that trainers are allocated to the correct student batches
    based on course requirements and expertise.

**Trainer Module**

Trainers are responsible for handling students in their assigned batches
and facilitating learning through structured content delivery. Their
responsibilities include:

-   **Adding students to specific batches**: Trainers can manually add
    students to batches, ensuring that each batch is properly assigned
    and managed.

-   **Uploading and releasing PPTs dynamically**: Trainers can control
    when PPTs are released, allowing for scheduled learning progression.

-   **Assigning tasks and homework**: Trainers can provide assignments
    to students based on the learning material covered.

-   **Reviewing student submissions**: Trainers have the ability to
    review uploaded student assignments and provide feedback for
    improvement.

**Student Module**

Students form the core of the Lernova platform, using it to access
course materials, submit assignments, and engage with their trainers.
Their functionalities include:

-   **Logging in and accessing course materials**: Students can log in
    using secure authentication and browse through assigned learning
    materials.

-   **Viewing assigned tasks and homework**: They can see all the
    assignments assigned by trainers and understand the requirements for
    each task.

-   **Uploading and submitting assignments**: Students can complete
    assignments and submit them digitally for trainer review.

-   **Submitting resumes (optional feature for career assistance)**:
    Students may have the option to upload resumes, which could be used
    for placement assistance in the future.
    ![](./image1.jpeg){width="6.5in"
    height="4.875in"}![](./image2.png){width="5.591301399825022in"
    height="9.544444444444444in"}

-   ![](./image3.png){width="5.934722222222222in"
    height="7.101851487314086in"}

**2. Non-Functional Requirements**

Lernova must meet several non-functional requirements to ensure
usability, security, and performance.

-   **Performance**: The platform must have fast response times,
    ensuring that students and trainers do not experience lag when
    accessing materials or submitting assignments.

-   **Security**: Authentication and authorization are managed via Clerk
    to ensure secure login and access to user-specific data.

-   **Scalability**: The platform must be capable of handling an
    increasing number of users as more institutions and students join.

-   **Usability**: The UI must be intuitive and easy to navigate for
    students, trainers, and admins. 

-   **Availability**: With Firebase as the backend, high uptime and
    reliability are ensured, minimizing downtime and disruptions.

**3. Prototypes, Wireframes, and Journey Map**

-   **Prototypes**: Initial designs will provide a visual representation
    of how Lernova\'s UI will look and function.

-   **Wireframes**: These will outline the fundamental structure and
    layout of different pages.

-   **Journey Map**: A detailed step-by-step guide will illustrate how
    users interact with the platform, from login to course completion.

**4. UX Documentation**

-   **User Personas**: Each role (Admin, Trainer, Student) will have
    defined user personas with their needs and goals clearly documented.

-   **User Flows**: Diagrams will show how each user type moves through
    the platform.

-   **UI Guidelines**: Standardized design elements, color schemes, and
    typography to ensure consistency.

**5. Architecture Design**

Lernova is built on modern web technologies:

-   **Frontend**: Next.js (React framework) is used for developing an
    interactive user interface.

-   **Backend**: Next.js API routes handle server-side logic.

-   **Database**: Firebase Firestore stores all user data, course
    materials, and assignments.

-   **Authentication**: Clerk ensures role-based authentication and
    security.

-   **Storage**: Firebase Storage is used to manage course-related files
    like PPTs and assignments.

**Process Documentation**

**1. Roadmaps**

**Strategy Roadmap**

-   Initial release with essential functionalities for admins, trainers,
    and students.

-   Gathering user feedback for continuous improvement.

-   Future AI integration for automated task evaluations.

**Technology Roadmap**

-   Implementing handwriting recognition for verifying student
    handwriting in assignments.

-   Developing a plagiarism detection system for assignments.

**Release Roadmap**

-   **Alpha Release**: Internal testing phase.

-   **Beta Release**: Limited release to educational institutions for
    user feedback.

-   **Public Release**: Full launch with all features in place.

**2. Metrics**

Lernova will track key performance indicators to measure success:

-   **User Engagement**: Monitoring daily and weekly active users.

-   **Assignment Completion Rate**: Evaluating how frequently students
    complete assigned tasks.

-   **Trainer Activity**: Assessing the number of assignments created
    and reviewed by trainers.

-   **System Performance**: Ensuring low response times, minimal
    downtime, and error-free operation.

**3. Standards**

Lernova follows strict development and operational standards:

-   **Code Standards**: Clean and modular code with adherence to best
    practices in Next.js and Firebase.

-   **Security Standards**: Ensuring secure user authentication and
    role-based access control.

-   **UI/UX Standards**: Maintaining accessibility and user-friendly
    design across all interfaces.

**Future Enhancements**

**Handwriting Recognition System**

A key future feature of Lernova is the integration of AI-based
handwriting recognition. This system will:

-   Identify the handwriting of specific students based on previous
    submissions.

-   Accept or reject assignments automatically if handwriting does not
    match registered samples.

-   Reduce cases of fraudulent submissions by verifying the authenticity
    of student work.

**Plagiarism Detection**

Another upcoming feature is an AI-driven plagiarism detection tool that
will:

-   Analyze student assignment submissions for copied content.

-   Generate originality reports to highlight similarities with existing
    materials.

-   Provide feedback to students, helping them understand how to improve
    their work.

Lernova is designed to revolutionize structured learning by offering a
well-organized, AI-powered educational ecosystem for students and
trainers alike. This documentation outlines the foundation, vision, and
planned growth of the platform.
