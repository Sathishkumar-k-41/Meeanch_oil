import { supabase } from "./supabase.js";

const $ = (id) => document.getElementById(id);

let currentUser = null;
let editingAddressId = null;

function showMessage(message, isError = false) {
  $("pageMessage").textContent = message;
  $("pageMessage").style.color = isError ? "#b42318" : "#19583b";
}

async function loadAccount() {
  showMessage("Loading account...");

  const { data: authData, error: authError } =
    await supabase.auth.getUser();

  if (authError || !authData.user) {
    window.location.replace("./login.html");
    return;
  }

  currentUser = authData.user;

  $("customerEmail").value = currentUser.email || "";

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", currentUser.id)
    .maybeSingle();

  if (error) {
    showMessage("Could not load profile: " + error.message, true);
    return;
  }

  $("customerName").value = profile?.full_name || "";
  $("customerPhone").value = profile?.phone || "";

  $("accountContent").classList.remove("hidden");
  showMessage("Account loaded successfully.");

  await loadAddresses();
}

async function saveProfile(event) {
  event.preventDefault();

  if (!currentUser) return;

  const full_name = $("customerName").value.trim();
  const phone = $("customerPhone").value.trim();

  if (!full_name) {
    showMessage("Please enter your name.", true);
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: currentUser.id,
      full_name,
      phone
    }, { onConflict: "id" });

  if (error) {
    showMessage("Profile save failed: " + error.message, true);
    return;
  }

  showMessage("Profile saved successfully.");
}

async function loadAddresses() {
  const list = $("addressList");
  list.replaceChildren();

  const { data, error } = await supabase
    .from("addresses")
    .select("id, label, full_address, city, pincode, landmark, is_default")
    .eq("user_id", currentUser.id)
    .order("is_default", { ascending: false });

  if (error) {
    showMessage("Could not load addresses: " + error.message, true);
    return;
  }

  if (!data || data.length === 0) {
    const message = document.createElement("p");
    message.textContent =
      "No saved addresses yet. Add your delivery address.";
    list.append(message);
    return;
  }

  for (const address of data) {
    const card = document.createElement("article");
    card.className = "address-card";

    const heading = document.createElement("strong");
    heading.textContent =
      `${address.label || "Address"}${address.is_default ? " (Default)" : ""}`;

    const details = document.createElement("p");
    details.textContent = [
      address.full_address,
      address.city,
      address.pincode,
      address.landmark ? "Landmark: " + address.landmark : ""
    ].filter(Boolean).join(", ");

    const actions = document.createElement("div");
    actions.className = "account-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "secondary-btn";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      openAddressForm(address);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "danger-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async () => {
      if (!confirm("Delete this saved address?")) return;

      const { error: deleteError } = await supabase
        .from("addresses")
        .delete()
        .eq("id", address.id)
        .eq("user_id", currentUser.id);

      if (deleteError) {
        showMessage("Delete failed: " + deleteError.message, true);
        return;
      }

      await loadAddresses();
      showMessage("Address deleted.");
    });

    actions.append(editButton, deleteButton);
    card.append(heading, details, actions);
    list.append(card);
  }
}

function openAddressForm(address = null) {
  editingAddressId = address?.id || null;

  $("addressForm").classList.remove("hidden");
  $("addressLabel").value = address?.label || "Home";
  $("fullAddress").value = address?.full_address || "";
  $("addressCity").value = address?.city || "";
  $("addressPincode").value = address?.pincode || "";
  $("addressLandmark").value = address?.landmark || "";
  $("defaultAddress").checked = address?.is_default || false;

  $("addressForm").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

async function saveAddress(event) {
  event.preventDefault();

  if (!currentUser) return;

  const address = {
    user_id: currentUser.id,
    label: $("addressLabel").value,
    full_address: $("fullAddress").value.trim(),
    city: $("addressCity").value.trim(),
    pincode: $("addressPincode").value.trim(),
    landmark: $("addressLandmark").value.trim() || null,
    is_default: $("defaultAddress").checked
  };

  if (!/^[0-9]{6}$/.test(address.pincode)) {
    showMessage("Enter a valid 6-digit PIN code.", true);
    return;
  }

  if (address.is_default) {
    const { error: resetError } = await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", currentUser.id);

    if (resetError) {
      showMessage("Could not update default address: " + resetError.message, true);
      return;
    }
  }

  let query = supabase.from("addresses");

  if (editingAddressId) {
    query = query
      .update(address)
      .eq("id", editingAddressId)
      .eq("user_id", currentUser.id);
  } else {
    query = query.insert(address);
  }

  const { error } = await query;

  if (error) {
    showMessage("Address save failed: " + error.message, true);
    return;
  }

  $("addressForm").reset();
  $("addressForm").classList.add("hidden");
  editingAddressId = null;

  await loadAddresses();
  showMessage("Address saved successfully.");
}

$("profileForm").addEventListener("submit", saveProfile);
$("addressForm").addEventListener("submit", saveAddress);

$("showAddressForm").addEventListener("click", () => {
  openAddressForm();
});

$("cancelAddressForm").addEventListener("click", () => {
  $("addressForm").reset();
  $("addressForm").classList.add("hidden");
  editingAddressId = null;
});

$("logoutBtn").addEventListener("click", async () => {
  $("logoutBtn").disabled = true;

  const { error } = await supabase.auth.signOut();

  if (error) {
    showMessage("Logout failed: " + error.message, true);
    $("logoutBtn").disabled = false;
    return;
  }

  window.location.replace("./login.html");
});

window.setAccountLang = function (lang) {
  if (window.i18n?.setLang) {
    window.i18n.setLang(lang);
  }

  localStorage.setItem("meenachi-language", lang);
  showMessage("Language preference updated.");
};

loadAccount();
