/**
 * 🔗 Synchrove Real-Time Cloudflare D1 SQL Database Syncing Engine
 */

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8787'
  : 'https://synchrove-hub-backend.omarkhayam4917.workers.dev';

/**
 * 🔄 Hydrate all local storage data from the remote Cloudflare D1 SQL Database
 */
async function syncFromCloud() {
  try {
    console.log("🔄 Synchronizing data from Cloudflare D1 database...");

    // 1. Fetch Projects
    const projectsRes = await fetch(`${API_BASE_URL}/api/projects`);
    if (projectsRes.ok) {
      const projects = await projectsRes.json();
      localStorage.setItem('synchrove_portfolio_projects', JSON.stringify(projects));
    }

    // 2. Fetch Users
    const usersRes = await fetch(`${API_BASE_URL}/api/users`);
    if (usersRes.ok) {
      const users = await usersRes.json();
      localStorage.setItem('synchrove_registered_users', JSON.stringify(users));
    }

    // 3. Fetch Workspaces
    const workspacesRes = await fetch(`${API_BASE_URL}/api/workspaces`);
    let workspaces = [];
    if (workspacesRes.ok) {
      workspaces = await workspacesRes.json();
      localStorage.setItem('synchrove_client_workspaces', JSON.stringify(workspaces));
    }

    // 4. Fetch scoped Invoices and Chats for each active workspace
    for (const ws of workspaces) {
      if (!ws.workspace_id) continue;

      // Scoped Invoices
      const invRes = await fetch(`${API_BASE_URL}/api/invoices?workspaceId=${ws.workspace_id}`);
      if (invRes.ok) {
        const invoices = await invRes.json();
        localStorage.setItem(`synchrove_invoices_${ws.workspace_id}`, JSON.stringify(invoices));
      }

      // Scoped Chats
      const chatRes = await fetch(`${API_BASE_URL}/api/chats?workspaceId=${ws.workspace_id}`);
      if (chatRes.ok) {
        const chats = await chatRes.json();
        localStorage.setItem(`synchrove_chats_${ws.workspace_id}`, JSON.stringify(chats));
      }
    }

    console.log("✅ Data synchronization successful!");
  } catch (error) {
    console.warn("⚠️ Cloud sync failed. Operating in offline/cached mode:", error);
  }
}

/**
 * ➕ Save/Sync a User to the Cloud Database
 */
async function syncUserToCloud(user) {
  try {
    await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
  } catch (err) {
    console.error("Failed to sync user to Cloud:", err);
  }
}

/**
 * ❌ Delete a User from the Cloud Database
 */
async function deleteUserFromCloud(email) {
  try {
    await fetch(`${API_BASE_URL}/api/users?email=${encodeURIComponent(email)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.error("Failed to delete user from Cloud:", err);
  }
}

/**
 * ➕ Save/Sync a Workspace to the Cloud Database
 */
async function syncWorkspaceToCloud(workspace) {
  try {
    await fetch(`${API_BASE_URL}/api/workspaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workspace)
    });
  } catch (err) {
    console.error("Failed to sync workspace to Cloud:", err);
  }
}

/**
 * ❌ Delete a Workspace from the Cloud Database
 */
async function deleteWorkspaceFromCloud(workspaceId) {
  try {
    await fetch(`${API_BASE_URL}/api/workspaces?id=${encodeURIComponent(workspaceId)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.error("Failed to delete workspace from Cloud:", err);
  }
}

/**
 * ➕ Save/Sync an Invoice to the Cloud Database
 */
async function syncInvoiceToCloud(invoice) {
  try {
    await fetch(`${API_BASE_URL}/api/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice)
    });
  } catch (err) {
    console.error("Failed to sync invoice to Cloud:", err);
  }
}

/**
 * ❌ Delete an Invoice from the Cloud Database
 */
async function deleteInvoiceFromCloud(invoiceId) {
  try {
    await fetch(`${API_BASE_URL}/api/invoices?id=${encodeURIComponent(invoiceId)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.error("Failed to delete invoice from Cloud:", err);
  }
}

/**
 * ➕ Save/Sync a Chat Message to the Cloud Database
 */
async function syncChatToCloud(chat) {
  try {
    await fetch(`${API_BASE_URL}/api/chats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chat)
    });
  } catch (err) {
    console.error("Failed to sync chat message to Cloud:", err);
  }
}

/**
 * ➕ Save/Sync a Project to the Cloud Database
 */
async function syncProjectToCloud(project) {
  try {
    await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
  } catch (err) {
    console.error("Failed to sync project to Cloud:", err);
  }
}

/**
 * ❌ Delete a Project from the Cloud Database
 */
async function deleteProjectFromCloud(projectId) {
  try {
    await fetch(`${API_BASE_URL}/api/projects?id=${encodeURIComponent(projectId)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.error("Failed to delete project from Cloud:", err);
  }
}
