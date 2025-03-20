import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Initialize the Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false,
})

// Function to clean HTML and convert to plain text
function cleanHtml(html) {
  if (!html) return ''
  
  // Remove HTML tags but preserve em tags as markdown
  return html
    .replace(/<em>(.*?)<\/em>/g, '*$1*')  // Convert <em> to markdown *
    .replace(/<a.*?>(.*?)<\/a>/g, '$1')   // Remove links but keep text
    .replace(/&nbsp;/g, ' ')              // Convert &nbsp; to space
    .replace(/<[^>]+>/g, '')              // Remove all other HTML tags
    .trim()
}

// Function to parse date string
function parseDate(dateStr) {
  if (!dateStr) return undefined
  
  // Try parsing as a year
  if (/^\d{4}$/.test(dateStr)) {
    return new Date(parseInt(dateStr), 0, 1).toISOString()
  }
  
  // Try parsing as a full date
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? undefined : date.toISOString()
}

// Function to convert text to block content
function textToBlocks(text) {
  if (!text) return []
  
  return text.split('\n\n').map(paragraph => ({
    _type: 'block',
    style: 'normal',
    children: [{
      _type: 'span',
      text: paragraph.trim()
    }]
  })).filter(block => block.children[0].text.length > 0)
}

const signageProjects = [
  {
    order: 4,
    title: "Harvard University",
    subtitle: "",
    client: "Harvard University Planning and Design",
    type: "Wayfinding",
    date: "2022",
    projectOverview: "The design and implementation of Harvard University's first comprehensive wayfinding program",
    projectDescription: "With Harvard University's recent expansion into Boston, they needed signage to direct people from North of Cambridge to the new Science and Engineering Complex in Allston. Working closely with major stakeholders and the Office of Planning, We developed a comprehensive family of pedestrian signs: Welcome markers at campus gateways; Orientation markers at key decision points; and Directional markers to reinforce route continuity—assuring users that they are on the right track. At each sign, users can access a campus map and an interactive map via QR codes. This is the first comprehensive wayfinding program at Harvard University.\n\nWith Harvard University's recent expansion into Boston, they faced a new challenge in guiding people from North Cambridge to the newly established Science and Engineering Complex in Allston. To address this need, we collaborated closely with major stakeholders and the Office of Planning to develop a comprehensive family of pedestrian signs. This innovative wayfinding system consists of three key components: Welcome markers strategically placed at campus gateways; orientation markers positioned at crucial decision points; and directional markers designed to reinforce route continuity. These elements work together to ensure that users can confidently navigate their way through the expanded campus, providing reassurance that they are on the correct path.\n\nThis project marks a milestone for Harvard University, as it represents their first comprehensive wayfinding program. By unifying the navigation experience across the expanded campus, this system not only facilitates easier movement between Cambridge and Allston but also reinforces Harvard's identity as a cohesive, forward-thinking institution adapting to its growing footprint."
  },
  {
    order: 7,
    title: "Imagining the Modern",
    subtitle: "",
    client: "Carnegie Museum of Art",
    type: "Exhibition Design",
    date: "2018",
    projectOverview: "HACLab Pittsburgh, an exhibition at The Carnegie museum of Art, demonstrated the city's national influence in the development of the modern American city",
    projectDescription: "The city of Pittsburgh encountered modern architecture through an ambitious program of urban revitalization in the 1950s and '60s. <em>HACLab Pittsburgh: Imagining the Modern</em> untangles Pittsburgh's complicated relationship with modern architecture and urban planning.\n\nIn this experimental presentation at Carnegie Museum of Art's Heinz Architectural Center, the task was to highlight successive histories of pioneering architectural successes, disrupted neighborhoods, and the utopian aspirations and ideals of public officials and business leaders. These intertwined narratives shape the exhibition's presentation, which includes abundant archival materials from the period, an active architecture studio, and a salon-style discussion space, all unearthing layers of history and a range of perspectives.\n\nThrough these stories, <em>HACLab Pittsburgh</em> demonstrated the city's national influence in the development of the modern American city, and focus on several neighborhoods and sites, including Gateway Center, the Lower Hill, Allegheny Center, and Oakland."
  },
  {
    order: 3,
    title: "Our Artificial Nature",
    subtitle: "",
    client: "Harvard Graduate School of Design",
    type: "Exhibition Design",
    date: "2023",
    projectOverview: "The graphic indentity, design support, and development of the exhibitions interpretive material for this exhibition at Harvard's Graduate School of Design.",
    projectDescription: "SIGNALS provided the graphic indentity, design support, and development of the exhibitions interpretive material for this exhibition at Harvard's Graduate School of Design.\n\n<a href=\"https://www.gsd.harvard.edu/exhibition/our-artificial-nature/\"><em>Our Artificial Nature</em></a> daylights the cultural, social, and technological processes emerging within design discourse in response to the environmental imperatives of our time. The in-progress research of the Center of Green Buildings and Cities (CGBC) core and affiliated research faculty at the GSD provides a window onto the often-invisible mechanics of the built environment that allow us to see, analyze, and design our future world in new and yet-unimagined ways. The collective body of work explores the challenging space between empirical and cultural information, scalable systems and local relevance, and data and design.\n\nThe exhibition calls attention to design practice as the creation of the artificial and the imagination of our constructed environment in a moment when our designed and natural worlds are fused. In this context the built environment accounts for 39% of global carbon emissions&nbsp; and our concept of our environmental change is shifting from a bucolic organic system to be dominated or restored toward an entangled system of biological, cultural, and technological processes. This quiet, hopeful thread of design research, emerging from the multiplicity of 21st century design narratives, strives for positive environmental impact. It addresses the present ecological paradigm by embracing degrowth as much as growth, and process as much as artifact in the deployment of design for the meaningful transformation of our shared world.\n\nOn the tenth anniversary of the Center for Green Buildings and Cities, the exhibition aims to situate the emerging research within a history of design for environmental change and solidify a dialogue around a new paradigm for environmental design. Positioned outside the framework of technological optimism and pessimism, <em>Our Artificial Nature</em> showcases our role as creators of the artificial, and designers of synthetic processes that engage continuously-becoming artifacts and environments informed by networked structures – from grounded, situated, and analog systems of knowledge to artificial intelligence and data-rich systems of information."
  },
  {
    order: 1,
    title: "Exhibit Columbus",
    subtitle: "",
    client: "Landmark Columbus Foundation",
    type: "Wayfinding",
    date: "2023",
    projectOverview: "Exhibit Columbus is a program that interprets Columbus, Indiana's modernist design heritage and engages the community through events, publications, and educational activities. The cycle *Public by Design* focused on activating the downtown area through collaborations between the local community, architects, and landscape architects. This cycle celebrated creative methods of collaboration that communities and designers could use to grow a sense of belonging and connection in public spaces.",
    projectDescription: "Exhibit Columbus is a program that interprets Columbus, Indiana's modernist design heritage and engages the community through events, publications, and educational activities. The cycle *Public by Design* focused on activating the downtown area through collaborations between the local community, architects, and landscape architects. This cycle celebrated creative methods of collaboration that communities and designers could use to grow a sense of belonging and connection in public spaces.\n\nThe development of a communication system presented the opportunity to work within an existing brand and design identity. This modernist foundation—bold shapes and colors, rooted in the reliance of Futura as a main typeface—allowed this cycle to develop into an authentic reflection of the unique sense of place and identity.\n\nThe wayfinding and signage system needed to help orient visitors to each installation, and define a hierarchy of information that points towards the next one in a manner that is clear, concise, and consistent. The system was experimental and ephemeral. They existed as a temporal set of signals—set apart from the noisy elements of civic regulation and organization—and help residents and visitors navigate the remarkable set of installations and interventions that encompass this cycle."
  },
  {
    order: 9,
    title: "MIT DUSP",
    subtitle: "",
    client: "MIT Department of Urban Studies and Planning",
    type: "Wayfinding",
    date: "2018",
    projectOverview: "A wayfinding system that responds to the graphic and architectural legacy of the Massachusetts Institute of Technology.",
    projectDescription: "The renovation of MIT's Samuel Tak Lee Building 9 for the Department of Urban Studies and Planning led to a new wayfinding system that responds to the building's modernist concrete with counterpoints of color. The new mark and environmental graphics provide tools of navigation with moments of intrigue."
  },
  {
    order: 2,
    title: "Boston City Hall",
    subtitle: "",
    client: "City of Boston",
    type: "Wayfinding",
    date: "2022",
    projectOverview: "Wayfinding on City Hall Plaza. Working closely with the Mayor's office, our team developed a series of elements that complement Sasaki's revamped design.",
    projectDescription: "As part of the reinvention of the surrounding plaza by Sasaki, the design team implemented a comprehensive wayfinding system for the site. The design of the project emerged from an exploration of the area's history—from an early indigenous settlement, to the landing ground for early colonial settlers of the city, through to it's notorious reputation as Scollay Square, and it's reinvention as the site of civic government.\n\nWorking closely with the Mayor's office, our team developed a series of elements that complement Sasaki's revamped design. The redesigned landscape included several firsts, such as adding the name of the place to each major entrance through large granite markers, recognizing the many voices that comprise the culture of Boston, and providing accessible navigation through the landscape on the plaza. These interventions give a renewed a sense of place and identity to the plaza.\n\nThe forms of the project reference the robust armature of the heroic building by Kallmann, McKinnell and Knowles (1968). In particular, the top three floors reference a classical dentil pattern, which capture light and shadow in dramatic ways. These forms became the reference point for all aspects of the design, using the rhythm and playful positive and negative spaces they create to bring a sense of human scale to the broad areas of the plaza. The signs are clad in bronze, which is also an elemental part of the building's materiality.\n\nThe system evolved to have four main elements: the identifying granite markers, a large feature wall, directional markers, and an interpretive set of elements inserted into the brick of the plaza."
  },
  {
    order: 6,
    title: "Gund Hall",
    subtitle: "",
    client: "Harvard Graduate School of Design",
    type: "Wayfinding & Donor Signage",
    date: "2020",
    projectOverview: "A sophisticated wayfinding system that enhances the strong, heroic architecture of Gund Hall, home to Harvard's Graduate School of Design.",
    projectDescription: "For Harvard's Graduate School of Design, we crafted a sophisticated wayfinding system that enhances the strong, heroic architecture of Gund Hall.&nbsp;\n\nThe project included donor identification, and entry markers fabricated from bronze with acid etched drawings from the school's notable alumni.&nbsp;\n\nA proposal for replacing the notorious 'donut' with a custom and movable furniture element, and an exterior signage program that uses the circular columns as found artifacts. &nbsp;Each piece ws designed to integrate seamlessly with the architectural context, providing clear guidance while celebrating the institution's legacy in design education."
  },
  {
    order: 8,
    title: "deCordova",
    subtitle: "Sculpture Park and Museum",
    client: "deCordova Sculpture Park and Museum",
    type: "Wayfinding",
    date: "2008",
    projectOverview: "The rethinking of visitor experiences and brand identity for the deCordova Sculpture Park and Museum.",
    projectDescription: "The rethinking of visitor experiences with the deCordova Sculpture Park and Museum began in 2009 with the development of a new identity. Since that time the studio developed maps, collateral materials, interior signage for several buildings, and exterior signage for the campus.&nbsp;\n\nThe project was initiated with a research and review phase, where museum members, non-members, boards, and staff were surveyed about the institution's most significant characteristics. The identity approach and signage program responded directly to these findings. The main identity is a dimensional wedge, overlapped to suggest the three-dimensional and temporal nature of the sculptural works on display. Colors reflect the seasonal change in the park, an essential character of the institution widely reflected in survey responses.&nbsp;\n\nSignage, a map, and other methods of communication were then developed comprehensively to provide access to the public throughout the campus in ways that are engaging, themed to the place, and encourage discovery."
  },
  {
    order: 5,
    title: "MASS MoCA",
    subtitle: "",
    client: "MASS MoCA",
    type: "Wayfinding",
    date: "2017",
    projectOverview: "Wayfinding for the largest contemporary art museum in the United States.",
    projectDescription: "MASS MoCA is the largest contemporary art museum in the United States, housed on a vast seventeen-acre industrial campus. Commissioned by the museum's leadership for the final phase of a twenty-year masterplan, the design team developed a family of wayfinding elements that help various users (art tourists, wedding guests, festival attendees, curious visitors, and the nearby population) navigate a complex aggregation of open and enclosed spaces to enhance a memorable cultural experience.\n\nThe project extends an already strong brand with new guides, customized typography, and a series of totemic wayfinding elements. These panels are crafted from two-inch-thick steel that remained from an earlier art installation, creating a strong identity that parallels the institution's merging of artworks with its industrial past.\n\nThe timeframe for the project was quick—four months from an agreement to opening day—and our solutions had to be nimble in the face of production schedules and the pressures of an aggressive construction schedule.\n\nWe met frequently with the museum team, conducting interviews and informational sessions, surveying guests, and repeatedly walking the campus to develop strategic locations for external signage as well as internal markers that did not compete with a strong curatorial program, but allowed for touch points that reassured visitors that they were indeed in the right place. As part of this process, a family of signage and place-making types emerged that embraced the material strategy of the architectural interventions (exposing the raw materials of the existing structures, not painting anything that was subsequently introduced to make the gallery spaces functional), the institutional brand and type (red, Futura), and the do-it-yourself ethos that the museum exhibits pervasively. Each of these were challenges that the team embraced to make a cohesive system."
  }
]

// Import signage projects
async function importSignageProjects() {
  try {
    // Delete existing signage projects first
    const query = '*[_type == "project" && type in ["Wayfinding", "Exhibition Design", "Wayfinding & Donor Signage"]]'
    const existingProjects = await client.fetch(query)
    
    console.log(`Found ${existingProjects.length} existing signage projects to delete`)
    
    for (const project of existingProjects) {
      await client.delete(project._id)
      console.log(`Deleted: ${project.title}`)
    }
    
    // Import new projects
    for (const project of signageProjects) {
      const document = {
        _type: 'project',
        title: project.title,
        subtitle: project.subtitle,
        client: project.client,
        type: project.type.toLowerCase().replace(/[^\w-]/g, '-'),
        kind: project.type,
        publishDate: parseDate(project.date),
        description: textToBlocks(cleanHtml(project.projectDescription)),
        shortDescription: cleanHtml(project.projectOverview).slice(0, 200),
        slug: {
          _type: 'slug',
          current: project.title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
        }
      }

      await client.create(document)
      console.log(`Imported: ${project.title}`)
    }
    
    console.log('All signage projects imported successfully!')
  } catch (error) {
    console.error('Error importing signage projects:', error)
  }
}

importSignageProjects() 