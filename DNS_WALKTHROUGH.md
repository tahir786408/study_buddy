# DNS Walkthrough

## What is DNS?
DNS (Domain Name System) is like the internet's phonebook. Computers don't actually understand names like "tahir-fareed.netlify.app" — they only understand numeric addresses called IP addresses (e.g. 104.198.14.52). DNS's job is to translate a human-readable domain name into the IP address of the server that's actually hosting the website.

## What happens when someone types a website address?

1. **You type the address** — e.g. you type `tahir-fareed.netlify.app` into your browser and hit enter.

2. **The browser asks a resolver** — your browser doesn't know the IP address either, so it asks a "DNS resolver" (usually run by your internet provider, like a middleman whose whole job is to look up addresses).

3. **The resolver asks the nameservers** — the resolver doesn't automatically know the answer either. It asks a chain of nameservers (servers responsible for keeping track of domain records) starting from the top level (like `.app`) down to the specific domain's nameserver, which is Netlify's in this case.

4. **The nameserver returns a record** — Netlify's nameserver holds a "record" for my site — a stored entry that says "this domain name points to this address." For a domain pointing to a service like Netlify, this is often a CNAME record.

5. **What is a CNAME record?** — A CNAME (Canonical Name) record doesn't point directly to an IP address. Instead, it points to another domain name — in my case, my site's actual Netlify domain points to Netlify's own hosting infrastructure. This lets Netlify move or scale their servers without me ever having to update anything on my end, since my CNAME just keeps pointing at Netlify's name, and Netlify manages the underlying IP addresses.

6. **The response comes back** — the resolver receives that record, resolves it down to a real IP address, and sends that IP address back to your browser.

7. **The browser connects to the host** — now that the browser has the actual IP address, it opens a connection directly to Netlify's server at that address, which then finds and sends back the correct files for my specific site (since one server can host many different sites).

8. **The page loads** — the browser receives the HTML, CSS, and any other files, and renders the page.

## Why this matters for my site
Right now my site uses Netlify's free `.netlify.app` subdomain, so Netlify manages all of this for me automatically — including HTTPS, which is why the padlock shows up in the browser without me having to do anything extra. If I ever connect a custom domain (like `tahirfareed.com`), I would need to go into my domain registrar's settings and add a CNAME record pointing my domain at Netlify's address — that's the piece that tells the internet's phonebook where my custom name should actually lead.