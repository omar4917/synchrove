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
      // Local development test: localhost:8787?subdomain=omar
      subdomain = url.searchParams.get('subdomain');
    }

    const pathParts = url.pathname.split('/').filter(Boolean);

    // ROUTE 1: API - Get all projects for the main Discovery Hub UI
    if (url.pathname === '/api/projects') {
      const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Content-Type": "application/json"
      };
      
      if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

      try {
        const { results } = await env.DB.prepare("SELECT * FROM projects").all();
        return new Response(JSON.stringify(results), { headers: corsHeaders });
      } catch (e) {
        return new Response(e.message, { status: 500, headers: corsHeaders });
      }
    }

    // ROUTE 2: Dynamic Gateway Redirector
    if (subdomain && pathParts.length === 2) {
      const techSlug = pathParts[0];
      const projectSlug = pathParts[1];

      try {
        const project = await env.DB.prepare(
          "SELECT target_url FROM projects WHERE subdomain_slug = ? AND tech_slug = ? AND project_slug = ?"
        ).bind(subdomain, techSlug, projectSlug).first();

        if (project && project.target_url) {
          return Response.redirect(project.target_url, 302);
        } else {
          return new Response("Project Not Found in Synchrove Hub.", { status: 404 });
        }
      } catch (e) {
        return new Response("Database Error: " + e.message, { status: 500 });
      }
    }

    // Default Response
    return new Response("Synchrove Hub Backend API is running!", { status: 200 });
  }
};
