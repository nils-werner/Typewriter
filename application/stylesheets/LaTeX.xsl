<?xml version='1.0' encoding='utf-8'?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
	<xsl:apply-templates select="document" />
</xsl:template>

<xsl:template match="document">
	<xsl:apply-templates select="h1 | h2 | h3 | h4 | h5 | h6 | hr" mode="groups"/>
</xsl:template>

<xsl:template match="h1" mode="groups">
	<div>
		<xsl:attribute name="class">
			<xsl:text>afterh1</xsl:text>
			<xsl:if test="position() != 1"> pagebreak</xsl:if>
		</xsl:attribute>
		<xsl:apply-templates select=". | following-sibling::*[not(starts-with(name(),'h')) and preceding-sibling::*[starts-with(name(),'h')][1] = current()]" mode="html" />
	</div>
	<xsl:if test="name(following-sibling::*[starts-with(name(),'h')]) != 'hr'"><hr /></xsl:if>
</xsl:template>

<xsl:template match="h2 | h3 | h4 | h5 | h6 | hr" mode="groups">
	<xsl:apply-templates select=". | following-sibling::*[not(starts-with(name(),'h')) and preceding-sibling::*[starts-with(name(),'h')][1] = current()]" mode="html" />
</xsl:template>

<xsl:template match="img" mode="html" priority="1">
	<img src="{@src}" alt="{@alt}" title="{@title}" />
	<xsl:if test="@title != ''">
		<span class="title"><xsl:value-of select="@title	" /></span>
	</xsl:if>
</xsl:template>

<xsl:template match="*" mode="html">
	<xsl:element name="{name()}">
		<xsl:apply-templates select="* | @* | text()" mode="html"/>
	</xsl:element>
</xsl:template>

<xsl:template match="@*" mode="html">
	<xsl:attribute name="{name()}">
		<xsl:value-of select="."/>
	</xsl:attribute>
</xsl:template>

</xsl:stylesheet>
