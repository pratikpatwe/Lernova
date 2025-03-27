import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  return (
    <section className="container mx-auto py-24 px-6 sm:px-8 lg:px-12">
      <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">Frequently Asked Questions</h2>
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm">
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1" className="border-b border-gray-200 py-2">
            <AccordionTrigger className="flex text-left text-lg font-medium hover:no-underline">
              What is the purpose of this platform?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-gray-600">
              This platform enables trainers, learners, and administrators to efficiently manage educational activities,
              distribute course materials, and streamline the learning process. Our comprehensive solution helps
              educational institutions digitize their workflows and enhance student engagement.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-b border-gray-200 py-2">
            <AccordionTrigger className="flex text-left text-lg font-medium hover:no-underline">
              How secure is the platform?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-gray-600">
              We implement industry-standard security measures including end-to-end encryption, regular security audits,
              and role-based access controls to protect all user data. Our platform is GDPR compliant and undergoes
              penetration testing quarterly to ensure the highest level of security.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-b border-gray-200 py-2">
            <AccordionTrigger className="flex text-left text-lg font-medium hover:no-underline">
              Can students submit resumes?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-gray-600">
              Yes, students can upload and submit resumes through the platform, which can be reviewed by instructors and
              administrators. The system supports multiple file formats including PDF, DOCX, and supports feedback
              mechanisms for career development.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="border-b border-gray-200 py-2">
            <AccordionTrigger className="flex text-left text-lg font-medium hover:no-underline">
              Can multiple trainers handle a batch?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-gray-600">
              Yes, our platform supports collaborative teaching where multiple trainers can be assigned to a single
              batch, with customizable permission levels. This enables specialized instructors to focus on their areas
              of expertise while maintaining a cohesive learning experience for students.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}

