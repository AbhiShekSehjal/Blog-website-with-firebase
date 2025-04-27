const loader = document.getElementById('loader');

// Select all buttons you want to trigger the loader
// const buttons = document.querySelectorAll('button, a'); // button and a tags

// buttons.forEach(button => {
//     button.addEventListener('click', () => {
//         loader.style.display = 'flex'; // Show loader
//     });
// });

// window.addEventListener('load', () => {
//     loader.style.display = 'none';
// });

// async function fetchData() {
//     loader.style.display = 'flex'; // show loading

//     await yourFirestoreFetchingCodeHere();

//     loader.style.display = 'none'; // hide loading
// }

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

// Initialize FireStore
const db = firebase.firestore();

// Initialize Firebase Storage
const storage = firebase.storage();

// Initialize Firebase Authentication
const auth = firebase.auth();



auth.onAuthStateChanged(user => {
    const CreateBlogLink = document.getElementById("CreateBlogLink");
    const logoutLink = document.getElementById("logoutLink");
    const loginLink = document.getElementById("loginLinkFromBlogSide");
    const signUpLink = document.getElementById("signUpLinkFromBlogSide");

    if (user) {
        logoutLink.style.display = "block"
        loginLink.style.display = "none"
        signUpLink.style.display = "none"
    } else {
        logoutLink.style.display = "none"
        CreateBlogLink.style.display = "none"
    }
})


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

        const blogForm = document.getElementById("blogForm");
        const blogTitle = document.getElementById("blogTitle").value;
        const blogContent = document.getElementById("blogContent").value;
        const imageFile = document.getElementById("imageFile").files[0];

        const user = auth.currentUser; // Get current logged-in user

        if (!imageFile) {
            alert("Please select an image");
            return;
        };

        const storageRef = storage.ref(`blogImage/${Date.now()}_${imageFile.name}`);

        await storageRef.put(imageFile);

        const imageURL = await storageRef.getDownloadURL();

        if (user) {
            try {
                await db.collection("blogs").add({
                    title: blogTitle,
                    content: blogContent,
                    imageURL: imageURL,
                    userEmail: user.email,
                    userId: user.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                alert("Blog posted successfully!");
                // blogForm.reset();
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
                <section class="dark">
	<div class="container py-4">

		<article class="postcard">
			<a class="postcard__img_link" href="#">
				<img class="postcard__img" src="${data.imageURL}" alt="Image Title" />
			</a>
			<div class="postcard__text">
				<h1 class="postcard__title"><a href="#">${data.title}</a></h1>
				<div class="postcard__subtitle small">
                ${createdAt}
				</div>
				<div class="postcard__bar"></div>
				<div class="postcard__preview-txt"><p>${data.content}</p></div>
				<ul class="postcard__tagbox">
					Posted By : &nbsp; &nbsp;
					<li class="tag__item play blue">
						<a href="#"><i class="fas fa-play mr-2"></i>${data.userEmail}</a>
					</li>
				</ul>
			</div>
            </article>
            <button class="btn btn-warning btn-sm" onclick="editPost('${doc.id}','${data.title}','${data.content}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deletePost('${doc.id}')">Delete</button>
            </div>
</section>
<hr></hr>
                `;

                blogsContainer.innerHTML += blogCard;
            });
        })
}


// EDIT post
function editPost(id, oldTitile, oldContent) {

    const newTitle = prompt("Edit title", oldTitile)
    const newContent = prompt("Edit content", oldContent)

    if (newTitle !== null && newContent !== null) {
        db.collection("blogs").doc(id).update({
            title: newTitle,
            content: newContent
        }).then(() => {
            window.location.reload();
            alert("Blog updated successfully!");
        }).catch(error => {
            alert("Blog update failed : " + error)
        })
    }
}

//DELETE post
function deletePost(id) {
    const confirmDelete = confirm("Are you sure you want to delete this blog?");

    if (confirmDelete) {
        db.collection("blogs").doc(id).delete()
            .then(() => {
                window.location.reload();
                alert("Blog deleted successfully!");
            })
            .catch(error => {
                alert("Blog delete failed: " + error.message);
            });
    }
}