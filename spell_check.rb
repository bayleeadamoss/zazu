require 'html_spellchecker'
require 'find'

# iterate over files, and generate HTML from Markdown
Find.find("./_site") do |path|
  if path.match(/html/)
    html = File.read(path)
    HTML_Spellchecker.english.spellcheck(html)
  end
end
