export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostParts = url.hostname.split('.');
    
    // Check if it's a subdomain gateway (e.g., omar.synchrove.com)
    const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    let subdomain = null;
    
    if (!isLocalhost && hostParts.length > 2) {
      subdomain = hostParts[0];
    } else if (isLocalhost) {
      subdomain = url.searchParams.get('subdomain');
    }

    const pathParts = url.pathname.split('/').filter(Boolean);

    // Global CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    // Pre-flight CORS handler
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // ═══════════════════════════════════════════
      // 1. PROJECTS ROUTE
      // ═══════════════════════════════════════════
      if (url.pathname === '/api/projects') {
        if (request.method === 'GET') {
          const { results } = await env.DB.prepare("SELECT * FROM projects").all();
          return new Response(JSON.stringify(results), { headers: corsHeaders });
        }
        
        if (request.method === 'POST') {
          const data = await request.json();
          await env.DB.prepare(
            `INSERT OR REPLACE INTO projects (id, creator_email, subdomain_slug, tech_slug, project_slug, live_url, title, category, status, description, image) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            data.id, data.creator_email, data.subdomain_slug, data.tech_slug, data.project_slug, 
            data.live_url, data.title, data.category, data.status, data.description, data.image
          ).run();
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        if (request.method === 'DELETE') {
          const id = url.searchParams.get('id');
          await env.DB.prepare("DELETE FROM projects WHERE id = ?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }
      }

      // ═══════════════════════════════════════════
      // 2. USERS ROUTE
      // ═══════════════════════════════════════════
      if (url.pathname === '/api/users') {
        if (request.method === 'GET') {
          const { results } = await env.DB.prepare("SELECT * FROM users").all();
          return new Response(JSON.stringify(results), { headers: corsHeaders });
        }

        if (request.method === 'POST') {
          const data = await request.json();
          await env.DB.prepare(
            `INSERT OR REPLACE INTO users (email, name, password, user_type, role, project, avatar) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            data.email, data.name, data.password, data.user_type, data.role, data.project, data.avatar
          ).run();
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        if (request.method === 'DELETE') {
          const email = url.searchParams.get('email');
          await env.DB.prepare("DELETE FROM users WHERE email = ?").bind(email).run();
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }
      }

      // ═══════════════════════════════════════════
      // 3. WORKSPACES ROUTE
      // ═══════════════════════════════════════════
      if (url.pathname === '/api/workspaces') {
        if (request.method === 'GET') {
          const { results } = await env.DB.prepare("SELECT * FROM workspaces").all();
          return new Response(JSON.stringify(results), { headers: corsHeaders });
        }

        if (request.method === 'POST') {
          const data = await request.json();
          await env.DB.prepare(
            `INSERT OR REPLACE INTO workspaces (workspace_id, name, email, project, user_type, role, avatar, creator_email) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            data.workspace_id, data.name, data.email, data.project, data.user_type, data.role, data.avatar, data.creator_email
          ).run();
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        if (request.method === 'DELETE') {
          const id = url.searchParams.get('id');
          await env.DB.prepare("DELETE FROM workspaces WHERE workspace_id = ?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }
      }

      // ═══════════════════════════════════════════
      // 4. CHATS ROUTE
      // ═══════════════════════════════════════════
      if (url.pathname === '/api/chats') {
        if (request.method === 'GET') {
          const workspaceId = url.searchParams.get('workspaceId');
          const { results } = await env.DB.prepare("SELECT * FROM chats WHERE workspace_id = ? ORDER BY id ASC").bind(workspaceId).all();
          return new Response(JSON.stringify(results), { headers: corsHeaders });
        }

        if (request.method === 'POST') {
          const data = await request.json();
          await env.DB.prepare(
            "INSERT INTO chats (workspace_id, sender, message, timestamp) VALUES (?, ?, ?, ?)"
          ).bind(data.workspace_id, data.sender, data.message, data.timestamp).run();
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }
      }

      // ═══════════════════════════════════════════
      // 5. INVOICES ROUTE
      // ═══════════════════════════════════════════
      if (url.pathname === '/api/invoices') {
        if (request.method === 'GET') {
          const workspaceId = url.searchParams.get('workspaceId');
          const { results } = await env.DB.prepare("SELECT * FROM invoices WHERE workspace_id = ?").bind(workspaceId).all();
          return new Response(JSON.stringify(results), { headers: corsHeaders });
        }

        if (request.method === 'POST') {
          const data = await request.json();
          await env.DB.prepare(
            "INSERT OR REPLACE INTO invoices (id, workspace_id, invoice_number, amount, status, date) VALUES (?, ?, ?, ?, ?, ?)"
          ).bind(data.id, data.workspace_id, data.invoice_number, data.amount, data.status, data.date).run();
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        if (request.method === 'DELETE') {
          const id = url.searchParams.get('id');
          await env.DB.prepare("DELETE FROM invoices WHERE id = ?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }
      }

      // ═══════════════════════════════════════════
      // 6. DYNAMIC SUBDOMAIN REDIRECTOR
      // ═══════════════════════════════════════════
      if (subdomain && pathParts.length === 2) {
        const techSlug = pathParts[0];
        const projectSlug = pathParts[1];

        const project = await env.DB.prepare(
          "SELECT live_url FROM projects WHERE subdomain_slug = ? AND tech_slug = ? AND project_slug = ?"
        ).bind(subdomain, techSlug, projectSlug).first();

        if (project && project.live_url) {
          return Response.redirect(project.live_url, 302);
        } else {
          return new Response("Project Not Found in Synchrove Hub.", { status: 404 });
        }
      }

      // Default Status Route
      return new Response(JSON.stringify({ status: "running", service: "Synchrove Hub Backend API" }), { headers: corsHeaders });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }
};
