const firebaseConfig = {
    apiKey: "AIzaSyACj9i8tWv5M-vtEofiybnXXqPx1Pt_xhw",
    authDomain: "stpractice-718e1.firebaseapp.com",
    projectId: "stpractice-718e1",
    storageBucket: "stpractice-718e1.firebasestorage.app",
    messagingSenderId: "85075723072",
    appId: "1:85075723072:web:e48adee4c930291947f0a5",
    measurementId: "G-6M4W2H1X1H"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// Initialize Firebase Authentication
const auth = firebase.auth();


//signup user
const signUpForm = document.getElementById("signUpForm");

if (signUpForm) {

    const signUpBtn = document.getElementById("signUpBtn");

    signUpBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            alert("User signed up:", userCredential.user);
            window.location.href = "blog.html";
        } catch (error) {
            alert("Signup error:", error.message);
        }
    });
}

//login user
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    const loginBtn = document.getElementById("loginBtn");

    loginBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log("Login successful:", userCredential.user);
            window.location.href = "blog.html";
        } catch (error) {
            console.error("Login error:", error.message);
        }
    });

}

//logout user
const logoutLink = document.getElementById("logoutLink");

if (logoutLink) {
    logoutLink.addEventListener("click", async () => {
        try {
            await auth.signOut();
            alert("Logout successful");
            window.location.href = "index.html"; // Redirect to home page
        } catch (error) {
            console.log("Logout failed:", error.message);
        }
    });
}

//add blog post
const addBlogBtn = document.getElementById("addBlogBtn");

if (addBlogBtn) {
    addBlogBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const blogTitle = document.getElementById("blogTitle").value;
        const blogContent = document.getElementById("blogContent").value;

        const user = auth.currentUser; // Get current logged-in user

        if (user) {
            try {
                await db.collection("blogs").add({
                    title: blogTitle,
                    content: blogContent,
                    userEmail: user.email,
                    userId: user.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                alert("Blog posted successfully!");
                window.location.href = "showBlogs.html";
            } catch (error) {
                alert("Blog post error : ", error.message)
            }
        } else {
            alert("You must be logged in to post a blog!")
            window.location.href = "login.html";
        }
    })
}

//show blogs
const blogsContainer = document.getElementById("blogsContainer");

if (blogsContainer) {
    db.collection("blogs")
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
            blogsContainer.innerHTML = "";

            snapshot.forEach((doc) => {
                const data = doc.data();

                const createdAt = data.createdAt ? data.createdAt.toDate().toLocaleString() : "No date available";

                const blogCard =
                    `
                <div class="card mt-5 col-9 offset-2">
  <div class="card-body">
    <h5 class="card-title">${data.title}</h5>
    <h6 class="card-subtitle mb-2 text-body-secondary">${createdAt}</h6>
    <p class="card-text">${data.content}</p>
    <a href="#" class="card-link">Posted by :<b> ${data.userEmail}</b></a>
  </div>
</div>
                `;

                blogsContainer.innerHTML += blogCard;
            });
        })
}


auth.onAuthStateChanged(user => {
    // const CreateBlogLink = document.getElementById("CreateBlogLinkFromBlogSide");
    const logoutLink = document.getElementById("logoutLink");
    const loginLink = document.getElementById("loginLinkFromBlogSide");
    const signUpLink = document.getElementById("signUpLinkFromBlogSide");

    if (user) {
        // CreateBlogLink.style.display = "block"
        logoutLink.style.display = "block"
        loginLink.style.display = "none"
        signUpLink.style.display = "none"
    } else {
        // CreateBlogLink.style.display = "none"
        logoutLink.style.display = "none"
        // loginLink.style.display = "block"
        // signUpLink.style.display = "block"
    }
})