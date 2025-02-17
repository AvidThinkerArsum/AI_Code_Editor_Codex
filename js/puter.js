"use strict";

export const IS_PUTER = puter.env === "app";

export function usePuter() {
    return IS_PUTER || puter.auth.isSignedIn();
}

async function uiSignIn() {
    document.getElementById("judge0-sign-in-btn").classList.add("judge0-hidden");
    const signOutBtn = document.getElementById("judge0-sign-out-btn");
    signOutBtn.classList.remove("judge0-hidden");

    const modelSelect = document.getElementById("judge0-chat-model-select");
    modelSelect.closest(".ui.selection.dropdown").classList.remove("disabled");

    const userInput = document.getElementById("judge0-chat-user-input");
    userInput.disabled = false;  // 🔥 Force-enable input
    userInput.placeholder = `Message ${modelSelect.value}`;
}



function uiSignOut() {
    document.getElementById("judge0-sign-in-btn").classList.remove("judge0-hidden");
    const signOutBtn = document.getElementById("judge0-sign-out-btn");
    signOutBtn.classList.add("judge0-hidden");
    signOutBtn.querySelector("#judge0-puter-username").innerText = "Sign out";

    const modelSelect = document.getElementById("judge0-chat-model-select");
    modelSelect.closest(".ui.selection.dropdown").classList.add("disabled");

    const userInput = document.getElementById("judge0-chat-user-input");
    userInput.disabled = true;
    userInput.placeholder = `Sign in to chat with ${modelSelect.value}`;
}


function updateSignInUI() {
    uiSignIn(); // Always show as signed in
}

async function signIn() {
    await puter.auth.signIn();
    updateSignInUI();
}

function signOut() {
    puter.auth.signOut();
    updateSignInUI();
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("judge0-sign-in-btn").addEventListener("click", signIn);
    document.getElementById("judge0-sign-out-btn").addEventListener("click", signOut);
    updateSignInUI();
});





async function openaiChat(messages, model = "gpt-3.5-turbo") {
    const API_KEY = process.env.OPENAI_API_KEY || ""; // Replace with your OpenAI API key

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: model,
            messages: messages
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

// Override puter.ai.chat to use OpenAI instead of Puter API
window.puter = window.puter || {};
window.puter.ai = {
    chat: async function (messages, options) {
        return openaiChat(messages, options.model);
    }
};

